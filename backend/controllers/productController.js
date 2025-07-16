import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";

// Public: Get all products
export const getAllProducts = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title", "category.name"]);

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("vendorId", "name email shopName")
    ;

    res.send({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Public: Get a product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("vendorId", "name email shopName")
    ;

    res.send({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get products by category ID (public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const products = await Product.find({ category: id })
      .populate("category", "name")
      .populate("vendorId", "name email shopName");

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
