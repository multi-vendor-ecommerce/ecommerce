import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";
import { toTitleCase } from "../utils/titleCase.js";

// Public: Get all products
export const getAllProducts = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title"]);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let baseQuery = Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    if (req.person?.role !== "admin") {
      baseQuery = baseQuery.select("title description images price category tags freeDelivery rating totalReviews");
    }

    const [products, total] = await Promise.all([
      baseQuery,
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      products,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error.",
      details: err.message,
    });
  }
};

// Protected: Get top selling products with conditional fields
export const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const isAdmin = req.person?.role === "admin";

    let query = Product.find({ status: "approved" })
      .sort({ unitsSold: -1 })
      .limit(limit)
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    // If not admin, select only safe fields
    if (!isAdmin) {
      query = query.select("title description images price category tags freeDelivery rating totalReviews");
    }

    const [products, total] = await Promise.all([
      query,
      Product.countDocuments({ status: "approved" }),
    ]);

    res.status(200).json({
      success: true,
      message: "Top selling products fetched successfully.",
      products,
      total,
      limit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top selling products.",
      error: err.message,
    });
  }
};

// Public: Get a product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name email shopName role");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).send({ success: true, message: "Product fetched successfully.", product });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message });
  }
};

// Public: Get products by category ID
export const getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    console.log("Fetching products for category ID:", categoryId);

    const products = await Product.find({ category: categoryId });
    console.log("Fetched products:", products);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin/Vendor: Add a new product
export const addProduct = async (req, res) => {
  try {
    let {
      title, brand, description, category, specifications, price,
      discountPrice, stock, sku, hsnCode, gstRate, isTaxable,
      freeDelivery, tags, video
    } = req.body;

    // === Basic Required Checks ===
    if (!title || !brand || !category || !sku || !hsnCode || !gstRate || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, brand, price, category, sku, hsnCode, gstRate",
      });
    }

    if (price < 0 || (discountPrice && discountPrice < 0)) {
      return res.status(400).json({ success: false, message: "Invalid price or discount price" });
    }

    if (stock && (isNaN(stock) || stock < 0)) {
      return res.status(400).json({ success: false, message: "Invalid stock value" });
    }

    const allowedGstRates = [0, 5, 12, 18, 28];
    if (!allowedGstRates.includes(Number(gstRate))) {
      return res.status(400).json({ success: false, message: "Invalid GST rate. Allowed: 0, 5, 12, 18, 28" });
    }

    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    if (!skuRegex.test(sku.trim())) {
      return res.status(400).json({
        success: false,
        message: "SKU must be 4–20 characters using letters, numbers, hyphens, or underscores only",
      });
    }

    if (!/^\d{4,8}$/.test(hsnCode.trim())) {
      return res.status(400).json({
        success: false,
        message: "HSN Code must be 4 to 8 digits.",
      });
    }

    const existing = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists. Please use a unique SKU.",
      });
    }

    // === Formatting ===
    title = toTitleCase(title.trim());
    brand = toTitleCase(brand.trim());
    sku = sku.trim().toUpperCase();
    hsnCode = hsnCode.trim();
    description = description?.trim() || "";

    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications);
      } catch {
        specifications = {};
      }
    }

    if (tags && Array.isArray(tags)) {
      tags = [...new Set(tags.map(tag => tag.trim().toLowerCase()))];
    }

    const imageUrls = req.files?.map(file => file.path) || [];

    const newProduct = await Product.create({
      createdBy: req.person.id,
      createdByRole: req.person.role,
      title,
      brand,
      description,
      images: imageUrls,
      video: video || null,
      category,
      specifications: specifications || {},
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock ? Number(stock) : 0,
      sku,
      hsnCode,
      gstRate: Number(gstRate),
      isTaxable: isTaxable !== undefined ? isTaxable : true,
      freeDelivery: freeDelivery || false,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: newProduct,
    });

  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding product.",
      error: err.message,
    });
  }
};

