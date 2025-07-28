import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";

// Public: Get all products
export const getAllProducts = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["title"]);

    let productQuery = Product.find(query).populate("category", "name");

    if (req.person?.role === "admin") {
      productQuery = productQuery.populate("vendorId", "name email shopName");
    } else {
      productQuery = productQuery.select("title description images price category tags freeDelivery rating totalReviews");
    }
    const products = await productQuery;

    res.status(200).send({ success: true, message: "Products fetched successfully.", products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message });
  }
};

// Public: Get a product
export const getProductById = async (req, res) => {
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


export const getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const products = await Product.find({ category: categoryId })
      .populate("category", "name")
      .populate("vendorId", "name email shopName");

    res.status(200).send({ success: true, message: "Products fetched successfully.", products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error.", error: err.message });
  }
};