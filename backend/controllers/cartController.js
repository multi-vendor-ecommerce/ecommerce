import User from "../models/User.js";
import Product from "../models/Products.js";

// Add to cart
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);

    const existingItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("cart.product");
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
