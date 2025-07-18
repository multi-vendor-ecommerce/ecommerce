import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";

// Public: Get all products
export const getAllProducts = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title"]);

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("vendorId", "name email shopName")
    ;

    res.status(200).send({ success: true, message: "Products fetched successfully.", products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message });
  }
};

// Public: Get a product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("vendorId", "name email shopName")
    ;

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).send({ success: true, message: "Product fetched successfully.", product });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message });
  }
};

// Get products by category ID (public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Category ID is required." });
    }

    const products = await Product.find({ category: id })
      .populate("category", "name")
      .populate("vendorId", "name email shopName");

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found in this category." });
    }

    return res.status(200).json({ success: true, message: "Products in category fetched successfully.", products });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message });
  }
};
