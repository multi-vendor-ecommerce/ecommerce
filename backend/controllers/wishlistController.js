import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.person?.id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(200).json({
          success: false,
          message: "Product already in wishlist",
          wishlist
        });
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate("products");

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.person?.id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
        wishlist: { products: [] },
      });
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.person?.id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        wishlist: { products: [] },
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist loaded successfully",
      wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.person?.id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
        wishlist: { products: [] },
      });
    }

    // Clear all products
    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
