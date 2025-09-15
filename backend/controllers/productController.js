import mongoose from "mongoose";
import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";
import { sendProductAddedMail, sendProductAddedAdminMail, sendProductStatusMail, sendVendorResubmittedProductMail, sendVendorDeletionRequestMail, sendProductDeletedByAdminMail } from "../services/email/sender.js";
import Vendor from "../models/Vendor.js";
import { validateProductFields } from "../utils/validateProductFields.js";
import { mergeImages } from "../utils/mergeImages.js";
import cloudinary from "../config/cloudinary.js";
import { safeSendMail } from "../utils/safeSendMail.js";

// Helper to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ==========================
// Get all products - handles public, admin, and vendor
// ==========================
export const getAllProducts = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title", "brand"]);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Vendor: restrict to own products
    if (req.person?.role === "vendor") {
      query.createdBy = req.person.id;
    }

    let baseQuery = Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    // Limit fields for public or vendor
    if (!req.person || req.person.role !== "admin") {
      if (req.person?.role === "vendor") {
        baseQuery = baseQuery.select("title description stock brand images price category discount tags freeDelivery rating totalReviews colors sizes status dimensions weight");
      } else {
        baseQuery = baseQuery.select("title description images price category discount tags freeDelivery rating totalReviews colors sizes dimensions weight");
        query.status = "approved";
      }
    }

    const [products, total] = await Promise.all([
      baseQuery,
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Products loaded.",
      products,
      total,
      page,
      limit
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load products.", error: err.message });
  }
};

// ==========================
// Get top selling products
// ==========================
export const getTopSellingProducts = async (req, res) => {
  try {
    // Accept query params for search/filter
    let query = buildQuery(req.query, ["title", "brand"]);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const role = req.person?.role;

    // Always show only approved products
    query.status = "approved";
    if (role === "vendor") {
      query.createdBy = req.person.id;
    }

    let baseQuery = Product.find(query)
      .sort({ unitsSold: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    if (role !== "admin") {
      if (role === "vendor") {
        baseQuery = baseQuery.select("title brand stock description images price category discount tags freeDelivery rating totalReviews colors sizes dimensions weight");
      } else {
        baseQuery = baseQuery.select("title description images price category discount tags freeDelivery rating totalReviews colors sizes dimensions weight");
      }
    }

    const [products, total] = await Promise.all([
      baseQuery,
      Product.countDocuments(query),
    ]);

    // Category stats calculation
    const categoryStatsMap = new Map();

    for (const product of products) {
      const categoryId = product.category?._id?.toString();
      if (!categoryId) continue;

      if (!categoryStatsMap.has(categoryId)) {
        categoryStatsMap.set(categoryId, {
          category: {
            _id: product.category._id,
            name: product.category.name,
          },
          totalUnitsSold: 0, totalRevenue: 0, productCount: 0, cumulativeRating: 0, ratingCount: 0,
        });
      }

      const stats = categoryStatsMap.get(categoryId);
      stats.totalUnitsSold += product.unitsSold || 0;
      stats.totalRevenue += product.totalRevenue || 0;
      stats.productCount += 1;

      if (product.rating > 0) {
        stats.cumulativeRating += product.rating;
        stats.ratingCount += 1;
      }
    }

    const categoryStats = Array.from(categoryStatsMap.values()).map(stat => ({
      ...stat,
      averageRating: stat.ratingCount > 0
        ? +(stat.cumulativeRating / stat.ratingCount).toFixed(2)
        : 0,
    }));

    res.status(200).json({
      success: true,
      message: "Top selling products loaded.",
      products,
      total,
      limit,
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load top selling products.", error: err.message });
  }
};

// ==========================
// Get a product by ID - supports public, admin, and vendor
// ==========================
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const isAdmin = req.person?.role === "admin";
    const isVendor = req.person?.role === "vendor";

    let baseQuery = Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    if (!isAdmin) {
      if (isVendor) {
        baseQuery = baseQuery.select("title description stock brand images price category discount tags freeDelivery rating totalReviews colors sizes status dimensions weight createdBy");
      } else {
        baseQuery = baseQuery.select("title description images price category discount tags freeDelivery rating totalReviews colors sizes dimensions weight");
      }
    }

    const [product] = await Promise.all([baseQuery]);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (isVendor && product.createdBy?._id?.toString() !== req.person.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({
      success: true,
      message: "Product loaded.",
      product
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load product.", error: err.message });
  }
};

// ==========================
// Get products by category ID
// ==========================
export const getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    const products = await Product.find({ category: categoryId });
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this category." });
    }
    res.status(200).json({
      success: true,
      message: "Products for category loaded.",
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load products for category.", error: error.message });
  }
};

// ==========================
// Add product
// ==========================
export const addProduct = async (req, res) => {
  try {
    let {
      title, brand, description, category, specifications, price,
      discount, stock, sku, hsnCode, gstRate,
      dimensions, weight, tags, video, colors, sizes
    } = req.body;

    // Validate category ObjectId
    if (!isValidObjectId(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    // Validate and sanitize SKU
    sku = sku ? sku.replace(/[^A-Za-z0-9_-]/g, "") : "";

    // Validate and sanitize price, discount, stock, gstRate, weight
    price = Number(price);
    discount = Number(discount);
    stock = Number(stock);
    gstRate = Number(gstRate);
    weight = Number(weight);

    // Validate product fields
    const productFields = {
      title, brand, description, category, specifications, price,
      discount, stock, sku, hsnCode, gstRate,
      dimensions, weight, tags, video, colors, sizes
    };

    // Images handling (if using file uploads)
    const images =
      req.files?.map(file => ({
        url: file.path,
        public_id: file.filename || file.public_id
      })) || [];

    productFields.images = images;

    const errors = validateProductFields(productFields, false);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }

    // === Formatting ===
    title = toTitleCase(title.trim());
    brand = toTitleCase(brand.trim());
    sku = sku.trim().toUpperCase();
    hsnCode = hsnCode.trim();
    description = description?.trim() || "";

    colors = Array.isArray(colors)
      ? [...new Set(colors.map(c => c.trim().toLowerCase()).filter(Boolean))]
      : [];

    sizes = Array.isArray(sizes)
      ? [...new Set(sizes.map(s => toTitleCase(s.replace(/[-_]/g, " ").trim())).filter(Boolean))]
      : [];

    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications);
      } catch {
        specifications = {};
      }
    }

    if (tags && Array.isArray(tags)) {
      tags = [...new Set(tags.map(tag => tag.trim().toLowerCase()).filter(Boolean))];
    }

    // Parse dimensions if string
    if (typeof dimensions === "string") {
      try {
        dimensions = JSON.parse(dimensions);
      } catch {
        dimensions = {};
      }
    }

    // Parse weight if string
    if (typeof weight === "string") {
      weight = Number(weight);
    }

    const existing = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "SKU already exists. Use a unique SKU." });
    }

    const newProduct = await Product.create({
      createdBy: req.person.id,
      title,
      brand,
      description,
      images,
      video: video || null,
      category,
      specifications: specifications || {},
      price: Number(price),
      discount: discount ? Math.floor(discount) : 0,
      stock: stock ? Number(stock) : 0,
      sku,
      hsnCode,
      gstRate: Number(gstRate),
      tags: tags || [],
      colors,
      sizes,
      dimensions: dimensions || {},
      weight: weight !== undefined ? Number(weight) : 0,
    });

    // Update vendor's productQuantity
    await Vendor.findByIdAndUpdate(
      req.person.id,
      { $inc: { productQuantity: 1 } }
    );

    // Send email to vendor and admin after product is added
    await safeSendMail(sendProductAddedMail, {
      to: req.person.email,
      productName: newProduct.title,
      productId: newProduct._id
    });

    await safeSendMail(sendProductAddedAdminMail, {
      to: process.env.ADMIN_EMAIL,
      vendorName: req.person.name,
      vendorShop: req.person.ShopName,
      vendorEmail: req.person.email,
      productName: newProduct.title,
    });

    res.status(201).json({
      success: true,
      message: "Product added.",
      product: newProduct
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: "Unable to add product.", error: err.message });
  }
};

// ==========================
// Edit product (admin & vendor)
// ==========================
export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const isAdmin = req.person?.role === "admin";
    const isVendor = req.person?.role === "vendor";

    let product = await Product.findById(productId).populate("createdBy", "email name shopName");
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    if (isVendor && !product.createdBy._id.equals(req.person.id)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    // 🔹 Build update object
    const update = {};
    const allowedVendorFields = [
      "title", "brand", "description", "images", "video",
      "price", "discount", "stock", "sku", "hsnCode", "gstRate",
      "tags", "colors", "sizes", "category", "dimensions", "weight"
    ];

    Object.keys(req.body || {}).forEach((key) => {
      if (isAdmin || allowedVendorFields.includes(key)) update[key] = req.body[key];
    });

    // 🔹 Parse JSON fields
    const parseIfJson = (val) => {
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    };

    update.category = parseIfJson(update.category);
    update.colors = parseIfJson(update.colors);
    update.sizes = parseIfJson(update.sizes);
    update.tags = parseIfJson(update.tags);
    update.dimensions = parseIfJson(update.dimensions);

    // Convert category object to ObjectId string if needed
    if (update.category && typeof update.category === "object" && update.category._id) {
      update.category = update.category._id;
    }

    // 🔹 Trim/format
    if (update.title) update.title = update.title.trim();
    if (update.brand) update.brand = update.brand.trim();
    if (update.sku) update.sku = update.sku.trim().toUpperCase();
    if (update.hsnCode) update.hsnCode = update.hsnCode.trim();
    if (update.description) update.description = update.description?.trim();

    // Arrays formatting
    if (Array.isArray(update.colors)) update.colors = [...new Set(update.colors.map(c => c.trim().toLowerCase()).filter(Boolean))];
    if (Array.isArray(update.sizes)) update.sizes = [...new Set(update.sizes.map(s => s.replace(/[-_]/g, " ").trim()).filter(Boolean))];
    if (Array.isArray(update.tags)) update.tags = [...new Set(update.tags.map(t => t.trim().toLowerCase()).filter(Boolean))];

    // Validate and sanitize fields before update
    if (update.sku) update.sku = update.sku.replace(/[^A-Za-z0-9_-]/g, "");
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.discount !== undefined) update.discount = Number(update.discount);
    if (update.stock !== undefined) update.stock = Number(update.stock);
    if (update.gstRate !== undefined) update.gstRate = Number(update.gstRate);
    if (update.weight !== undefined) update.weight = Number(update.weight);

    // Validate category ObjectId if present
    if (update.category && !isValidObjectId(update.category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    // 🔹 Validation
    const errors = validateProductFields(update, true);
    if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(" ") });

    // 🔹 Handle image updates
    const mergedImages = mergeImages(req);
    if (mergedImages.length > 0) update.images = mergedImages;

    // 🔹 STATUS & EMAIL LOGIC
    if (isVendor) {
      if (product.status === "rejected") {
        update.status = "pending"; // back for admin review
        await safeSendMail(sendVendorResubmittedProductMail, {
          to: process.env.ADMIN_EMAIL,
          productName: product.title,
          productId: product._id,
          vendorName: product.createdBy.name,
          vendorShop: product.createdBy.shopName
        });
      }
      // approved product edited → no email
    }

    if (isAdmin && update.status) {
      const msg = update.status === "approved"
        ? "Your product has been approved and is now live."
        : "Your product has been rejected. Please review and resubmit.";

      await safeSendMail(sendProductStatusMail, {
        to: product.createdBy.email,
        productStatus: update.status,
        productName: product.title,
        productId: product._id,
        vendorName: product.createdBy.name,
        vendorShop: product.createdBy.shopName,
        statusMsg: msg
      });
    }

    // 🔹 Save updates
    product = await Product.findByIdAndUpdate(productId, update, { new: true, runValidators: true })
      .populate("createdBy", "email name shopName");

    res.status(200).json({ success: true, product, message: "Product updated successfully." });
  } catch (err) {
    console.error("Edit Product Error:", err);
    res.status(500).json({ success: false, message: "Unable to update product." });
  }
};

// ==========================
// Delete product (admin & vendor)
// ==========================
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const isAdmin = req.person?.role === "admin";
    const isVendor = req.person?.role === "vendor";

    let product = await Product.findById(productId).populate("createdBy", "email name shopName");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (isVendor && !product.createdBy._id.equals(req.person.id)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (isVendor) {
      // Vendor requests deletion → soft delete (status pending)
      product.status = "pendingDeletion";
      await product.save();

      // Notify admin
      await safeSendMail(sendVendorDeletionRequestMail, {
        to: process.env.ADMIN_EMAIL,
        productName: product.title,
        productId: product._id,
        vendorName: product.createdBy.name,
        vendorShop: product.createdBy.shopName,
      });

      return res.status(200).json({
        success: true,
        message: "Deletion request submitted. Awaiting admin approval."
      });
    }

    if (isAdmin) {
      // Admin deletes product → hard delete
      // Delete images from Cloudinary
      if (Array.isArray(product.images)) {
        for (const img of product.images) {
          if (img.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch (err) {
              console.error("Failed to delete image from Cloudinary:", img.public_id, err);
            }
          }
        }
      }

      await Product.findByIdAndDelete(productId);

      // Notify vendor
      await safeSendMail(sendProductDeletedByAdminMail, {
        to: product.createdBy.email,
        productName: product.title,
        productId: product._id,
        adminName: req.person.name || "Admin",
      });

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully."
      });
    }

    res.status(403).json({ success: false, message: "Unauthorized action." });

  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete product.",
      error: error.message
    });
  }
};

// ==========================
// Update product status (approve/reject/delete)
// ==========================
export const updateProductStatus = async (req, res) => {
  let { status } = req.body;
  status = status?.toLowerCase();

  const productId = req.params.id;
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }

  const validStatuses = ["approved", "rejected", "inactive", "deletionrejected", "deleted"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status update." });
  }

  try {
    // Fetch product & vendor
    let product = await Product.findById(req.params.id).populate("createdBy", "email name shopName");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const vendorInfo = {
      to: product.createdBy.email,
      productStatus: status === "active" ? "approved" : status,
      productName: product.title,
      productId: product._id,
      vendorName: product.createdBy.name,
      vendorShop: product.createdBy.shopName
    };

    // === Handle Deletion Rejected ===
    if (req.person.role === "admin" && status === "deletionrejected") {
      product.status = "approved"; // fallback to approved
      await product.save();

      vendorInfo.productStatus = "deletionRejected";
      await safeSendMail(sendProductStatusMail, vendorInfo);

      return res.status(200).json({
        success: true,
        product,
        message: "Delete request rejected. Product is now approved."
      });
    }

    // === Handle Deleted ===
    if (req.person.role === "admin" && status === "deleted") {
      if (Array.isArray(product.images) && product.images.length > 0) {
        await Promise.all(
          product.images.map(img =>
            img.public_id
              ? cloudinary.uploader.destroy(img.public_id).catch(err => {
                  console.error("Cloudinary deletion failed:", img.public_id, err);
                })
              : null
          )
        );
      }

      await product.deleteOne();

      vendorInfo.productStatus = "deleted";
      await safeSendMail(sendProductStatusMail, vendorInfo);

      return res.status(200).json({
        success: true,
        product,
        message: "Product deleted successfully."
      });
    }

    // === Handle Normal Status Updates ===
    product.status = status;
    await product.save();

    await safeSendMail(sendProductStatusMail, vendorInfo);

    return res.status(200).json({
      success: true,
      product,
      message: `Product ${toTitleCase(status)}.`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update product status",
      error: error.message
    });
  }
};