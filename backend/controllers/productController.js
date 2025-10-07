import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";
import { sendProductAddedMail, sendProductAddedAdminMail, sendProductStatusMail, sendVendorResubmittedProductMail, sendVendorDeletionRequestMail, sendProductDeletedByAdminMail } from "../services/email/sender.js";
import Vendor from "../models/Vendor.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import { validateProductFields } from "../utils/validateProductFields.js";
import { deleteCloudinaryImages } from "../utils/deleteCloudinaryImages.js";
import { mergeImages } from "../utils/mergeImages.js";
import cloudinary from "../config/cloudinary.js";
import { safeSendMail } from "../utils/safeSendMail.js";
import { splitAndClean } from "../utils/splitAndClean.js";
import { isValidObjectId } from "mongoose";

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
        baseQuery = baseQuery.select("title description stock brand sku gstRate images price category discount tags freeDelivery rating totalReviews colors sizes status dimensions weight createdBy hsnCode");
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

    if (!isValidObjectId(category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    sku = sku ? sku.replace(/[^A-Za-z0-9_-]/g, "") : "";
    price = Number(price);
    discount = Number(discount);
    stock = Number(stock);
    gstRate = Number(gstRate);
    weight = Number(weight);

    // Normalize arrays
    tags = splitAndClean(tags);
    colors = splitAndClean(colors);
    sizes = splitAndClean(sizes, "upper");

    if (typeof dimensions === "string") {
      try {
        dimensions = JSON.parse(dimensions);
      } catch {
        dimensions = {};
      }
    }

    const images =
      req.files?.map(file => ({
        url: file.path,
        public_id: file.filename || file.public_id
      })) || [];

    const productFields = {
      title, brand, description, category, specifications, price,
      discount, stock, sku, hsnCode, gstRate,
      dimensions, weight, tags, video, colors, sizes, images
    };

    const { isValid, errors } = validateProductFields(productFields, false);
    if (!isValid) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }

    title = toTitleCase(title.trim());
    brand = toTitleCase(brand.trim());
    sku = sku.trim().toUpperCase();
    hsnCode = hsnCode.trim();
    description = description?.trim() || "";

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
      price: Number(price),
      discount: discount ? Math.floor(discount) : 0,
      stock: stock ? Number(stock) : 0,
      sku,
      hsnCode,
      gstRate: Number(gstRate),
      tags,
      colors,
      sizes,
      dimensions: dimensions || {},
      weight: weight !== undefined ? Number(weight) : 0,
    });

    const vendor = await Vendor.findByIdAndUpdate(req.person.id, { $inc: { productQuantity: 1 } });

    await safeSendMail(sendProductAddedMail, {
      to: vendor?.email,
      productName: newProduct.title,
      productId: newProduct._id
    });

    await safeSendMail(sendProductAddedAdminMail, {
      to: process.env.ADMIN_EMAIL,
      vendorName: vendor?.name,
      vendorShop: vendor?.shopName,
      vendorEmail: vendor?.email,
      productName: newProduct.title,
    });

    res.status(201).json({ success: true, message: "Product added.", product: newProduct });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: "Unable to add product.", error: err.message });
  }
};

// ==========================
// Edit product
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

    const update = {};
    const allowedVendorFields = [
      "title", "brand", "description", "images", "video",
      "price", "discount", "stock", "sku", "hsnCode", "gstRate",
      "tags", "colors", "sizes", "category", "dimensions", "weight"
    ];

    Object.keys(req.body || {}).forEach((key) => {
      if (isAdmin || allowedVendorFields.includes(key)) update[key] = req.body[key];
    });

    const parseIfJson = (val) => {
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    };

    update.category = parseIfJson(update.category);
    update.colors = splitAndClean(parseIfJson(update.colors));
    update.sizes = splitAndClean(parseIfJson(update.sizes), "upper");
    update.tags = splitAndClean(parseIfJson(update.tags));
    update.dimensions = parseIfJson(update.dimensions);

    if (update.category && typeof update.category === "object" && update.category._id) {
      update.category = update.category._id;
    }

    if (update.title) update.title = update.title.trim();
    if (update.brand) update.brand = update.brand.trim();
    if (update.sku) update.sku = update.sku.trim().toUpperCase();
    if (update.hsnCode) update.hsnCode = update.hsnCode.trim();
    if (update.description) update.description = update.description?.trim();

    if (update.sku) update.sku = update.sku.replace(/[^A-Za-z0-9_-]/g, "");
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.discount !== undefined) update.discount = Number(update.discount);
    if (update.stock !== undefined) update.stock = Number(update.stock);
    if (update.gstRate !== undefined) update.gstRate = Number(update.gstRate);
    if (update.weight !== undefined) update.weight = Number(update.weight);

    if (update.category && !isValidObjectId(update.category)) {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    // ✅ Prevent overwriting createdBy
    if (update.createdBy) {
      delete update.createdBy;
    }

    const { isValid, errors } = validateProductFields(update, true);
    if (!isValid) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }

    const mergedImages = mergeImages(req);
    if (mergedImages.length > 0) update.images = mergedImages;

    if (isVendor) {
      if (product.status === "rejected") {
        update.status = "pending";
        await safeSendMail(sendVendorResubmittedProductMail, {
          to: process.env.ADMIN_EMAIL,
          productName: product.title,
          productId: product._id,
          vendorName: product.createdBy.name,
          vendorShop: product.createdBy.shopName
        });
      }
    }

    if (isAdmin && update.status) {
      await safeSendMail(sendProductStatusMail, {
        to: product.createdBy.email,
        productStatus: update.status,
        productName: product.title,
        productId: product._id,
        vendorName: product.createdBy.name,
        vendorShop: product.createdBy.shopName,
      });
    }

    product = await Product.findByIdAndUpdate(
      productId,
      update,
      { new: true, runValidators: true }
    ).populate("createdBy", "email name shopName");

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
  const productId = req.params.id;
  const isAdmin = req.person?.role === "admin";
  const isVendor = req.person?.role === "vendor";

  try {
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

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
      if (product?.images.length > 0) {
        await deleteCloudinaryImages(product.images);
      }

      const review = req.body.review.trim() || "";

      // Save a review record
      if (review && product.status === "deleted") {
        await Review.create({
          targetId: product?._id,
          targetType: toTitleCase("product"),
          adminId: req?.person.id,
          status: product?.status,
          review
        });
      }

      await Product.findByIdAndDelete(productId);

      // Notify vendor
      await safeSendMail(sendProductDeletedByAdminMail, {
        to: product?.createdBy.email,
        productName: product?.title,
        productId: product?._id,
        adminName: req?.person.name || "Admin",
        review
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
// Update product status (approve/reject/delete) with review/review
// ==========================
export const updateProductStatus = async (req, res) => {
  let { status, review } = req.body; // admin-provided review
  status = status?.toLowerCase();
  review = review.trim();

  if (req.person?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }

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
    let product = await Product.findById(productId).populate("createdBy", "email name shopName");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const vendorInfo = {
      to: product.createdBy.email,
      productStatus: status === "active" ? "approved" : status,
      productName: product.title,
      productId: product._id,
      vendorName: product.createdBy.name,
      vendorShop: product.createdBy.shopName,
      review // <-- use review here
    };

    // === Handle Deletion Rejected ===
    if (req.person.role === "admin" && status === "deletionrejected") {
      product.status = "approved"; // fallback to approved
      await product.save();

      if (review && !["active", "pending"].includes(product.status)) {
        await Review.create({
          targetId: product._id,
          targetType: "Product",
          adminId: req.person.id,
          status: "deletionRejected",
          review
        });
      }

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
        await deleteCloudinaryImages(product.images);
      }

      await Review.create({
        targetId: product._id,
        targetType: "Product",
        adminId: req.person.id,
        status: "deleted",
        review
      });

      await product.deleteOne();

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

    await Review.create({
      targetId: product._id,
      targetType: "Product",
      adminId: req.person.id,
      status,
      review
    });

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

// Recently Viewed Products
export const getPendingBuyNowProducts = async (req, res) => {
  try {
    const userId = req.person.id;

    // Fetch only Buy Now + Pending orders, sorted by recent
    const pendingOrders = await Order.find({
      user: userId,
      source: "buyNow",
      orderStatus: "pending",
    })
      .populate({
        path: "orderItems.product",
        populate: [
          { path: "createdBy", select: "_id name email role shopName" },
          { path: "category", select: "_id name" }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const products = [];
    const seen = new Set();

    for (const order of pendingOrders) {
      for (const item of order.orderItems) {
        if (item.product?._id && !seen.has(item.product._id.toString())) {
          seen.add(item.product._id.toString());
          products.push(item.product);
        }
      }
      if (products.length >= 10) break;
    }

    res.status(200).json({
      success: true,
      message: "Top 10 pending Buy Now products loaded successfully.",
      products,
      total: products.length,
      page: 1,
      limit: 10
    });

  } catch (err) {
    console.error("Pending Buy Now Products Error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load Buy Now products.",
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      category,
      brand,
      colors,
      sizes,
      tags,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = buildQuery({ search: q }, ["title", "brand"], "status");

    query.status = "approved";

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Category filter
    if (category && isValidObjectId(category)) query.category = category;

    // Brand filter (multiple comma-separated brands)
    if (brand) query.brand = { $in: brand.split(",").map(b => b.trim()) };

    // Array filters: colors, sizes, tags
    if (colors) query.colors = { $in: colors.split(",").map(c => c.trim()) };
    if (sizes) query.sizes = { $in: sizes.split(",").map(s => s.trim().toUpperCase()) };
    if (tags) query.tags = { $in: tags.split(",").map(t => t.trim().toLowerCase()) };

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    let sortObj = { createdAt: -1 }; // default newest first
    if (sort === "priceLow") sortObj = { price: 1 };
    if (sort === "priceHigh") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { rating: -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .populate("createdBy", "name shopName role")
        .select("title description images price category discount rating colors sizes")
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      message: "Products loaded successfully.",
      products,
      total,
      page: Number(page),
      limit: Number(limit)
    });

  } catch (err) {
    console.error("Search Products Error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to search products.",
      error: err.message
    });
  }
};
