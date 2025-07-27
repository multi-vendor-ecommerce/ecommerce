const PUBLIC_FIELDS = "title description images price category tags freeDelivery rating totalReviews";
import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";

//  Public: Get all products
export const getAllProductsPublic = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title"]);
    const products = await Product.find({ ...query, status: "approved" })  //  only approved
      .select(PUBLIC_FIELDS)
      .populate("category", "name");

    res.status(200).json({ success: true, message: "Products fetched successfully.", products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//  Public: Get a product by ID
export const getProductByIdPublic = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: "approved" })
      .select(PUBLIC_FIELDS)
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Product fetched successfully.", product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//  Public: Get products by category ID
export const getProductsByCategoryId = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.id,
      status: "approved",
    })
      .select(PUBLIC_FIELDS)
      .populate("category", "name");

    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


//  Admin: Get all products (any status)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title"]);
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("vendorId", "name email shopName");

    res.status(200).json({ success: true, message: "Admin products fetched successfully.", products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//  Admin: Get product by ID
export const getProductByIdAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("vendorId", "name email shopName");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Admin product fetched successfully.", product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};