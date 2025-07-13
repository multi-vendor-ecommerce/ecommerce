import Product from "../models/Products.js";

// Public: Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
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