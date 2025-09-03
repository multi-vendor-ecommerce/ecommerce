import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";
import { sendProductAddedMail, sendProductAddedAdminMail, sendProductStatusMail } from "../services/email/sender.js";
import Vendor from "../models/Vendor.js";

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
        baseQuery = baseQuery.select("title description brand images price category discount tags freeDelivery rating totalReviews colors sizes status");
      } else {
        baseQuery = baseQuery.select("title description images price category discount tags freeDelivery rating totalReviews colors sizes");
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
        baseQuery = baseQuery.select("title brand description images price category discount tags freeDelivery rating totalReviews colors sizes");
      } else {
        baseQuery = baseQuery.select("title description images price category discount tags freeDelivery rating totalReviews colors sizes");
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
    const isAdmin = req.person?.role === "admin";
    const isVendor = req.person?.role === "vendor";

    let baseQuery = Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    if (!isAdmin) {
      baseQuery = baseQuery.select(
        "title description images price discount category tags freeDelivery rating totalReviews colors sizes"
      );
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
      discount, stock, sku, hsnCode, gstRate, isTaxable,
      freeDelivery, tags, video, colors, sizes
    } = req.body;

    // === Basic Required Checks ===
    if (!title || !brand || !category || !sku || !hsnCode || !gstRate || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Missing required product fields.",
      });
    }

    if (price < 0) {
      return res.status(400).json({ success: false, message: "Invalid price value." });
    }

    if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100.",
      });
    }

    if (stock && (isNaN(stock) || stock < 0)) {
      return res.status(400).json({ success: false, message: "Invalid stock value." });
    }

    const allowedGstRates = [0, 5, 12, 18, 28];
    if (!allowedGstRates.includes(Number(gstRate))) {
      return res.status(400).json({ success: false, message: "Invalid GST rate." });
    }

    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    if (!skuRegex.test(sku.trim())) {
      return res.status(400).json({
        success: false,
        message: "SKU must be 4-20 characters using letters, numbers, hyphens, or underscores only."
      });
    }

    if (!/^\d{4,8}$/.test(hsnCode.trim())) {
      return res.status(400).json({ success: false, message: "HSN Code must be 4 to 8 digits." });
    }

    // === Optional Field: Colors ===
    if (colors) {
      if (Array.isArray(colors)) {
        colors = colors.map(c => c.trim().toLowerCase()).filter(Boolean);
      } else if (typeof colors === "string") {
        colors = colors.split(",").map(c => c.trim().toLowerCase()).filter(Boolean);
      } else {
        return res.status(400).json({ success: false, message: "Colors must be an array or string." });
      }
    }

    // === Optional Field: Tags ===
    if (tags) {
      if (Array.isArray(tags)) {
        tags = tags.map(tag => tag.trim().toLowerCase()).filter(Boolean);
      } else if (typeof tags === "string") {
        tags = tags.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean);
      } else {
        return res.status(400).json({ success: false, message: "Tags must be an array or string." });
      }
    }

    // === Optional Field: Sizes ===
    const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "Free Size"];
    if (sizes) {
      if (Array.isArray(sizes)) {
        sizes = sizes.map(s => toTitleCase(s.replace(/[-_]/g, " ").trim())).filter(Boolean);
      } else if (typeof sizes === "string") {
        sizes = sizes.split(",").map(s => toTitleCase(s.replace(/[-_]/g, " ").trim())).filter(Boolean);
      } else {
        return res.status(400).json({ success: false, message: "Sizes must be an array or string." });
      }
      const isValidSizes = sizes.every(size => allowedSizes.includes(size));
      if (!isValidSizes) {
        return res.status(400).json({ success: false, message: "Invalid size(s) provided." });
      }
    }

    const existing = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "SKU already exists. Use a unique SKU." });
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

    const images =
      req.files?.map(file => ({
        url: file.path,
        public_id: file.filename || file.public_id
      })) || [];

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
      isTaxable: isTaxable !== undefined ? isTaxable : true,
      freeDelivery: freeDelivery || false,
      tags: tags || [],
      colors,
      sizes,
    });

    // Update vendor's productQuantity
    await Vendor.findByIdAndUpdate(
      req.person.id,
      { $inc: { productQuantity: 1 } }
    );

    // Send email to vendor and admin after product is added
    try {
      // Email to vendor
      await sendProductAddedMail({
        to: req.person.email,
        productName: newProduct.title,
        productId: newProduct._id
      });

      // Email to admin (replace with your admin email or fetch from config/db)
      await sendProductAddedAdminMail({
        to: process.env.ADMIN_EMAIL, // <-- put your admin email here
        vendorName: req.person.name,
        vendorShop: req.person.ShopName,
        vendorEmail: req.person.email,
        productName: newProduct.title,
      });
    } catch (emailErr) {
      console.error("Product added email failed:", emailErr);
      // You can choose to ignore this error or log it only
    }

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
// Update product status (approve/reject)
// ==========================
export const updateProductStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("createdBy", "email name shopName");

    // Send email to vendor based on status
    try {
      await sendProductStatusMail({
        to: product.createdBy.email,
        productStatus: status,
        productName: product.title,
        productId: product._id,
        vendorName: product.createdBy.name,
        vendorShop: product.createdBy.shopName
      });
    } catch (emailErr) {
      console.error("Product status email failed:", emailErr);
    }

    res.status(200).json({
      success: true,
      product,
      message: `Product ${toTitleCase(status)}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Unable to update product status`, error: error.message });
  }
};