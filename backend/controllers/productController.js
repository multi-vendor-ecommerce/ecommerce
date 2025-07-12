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