import Product from "../models/Products.js";

// Public: Get all approved products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")         // populate only category name
      .populate("vendorId", "name email shopName");  // populate only vendor name/email
    ;

    res.send({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};