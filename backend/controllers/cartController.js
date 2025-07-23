import User from "../models/User.js";
import Product from "../models/Products.js";

// Add to Cart
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Product ID and positive quantity are required.",
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const user = await User.findById(userId);
    const index = user.cart.findIndex(item => item.product.toString() === productId);

    if (index !== -1) {
      user.cart[index].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, message: "Added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);
    const originalLength = user.cart.length;

    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    if (user.cart.length === originalLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    await user.save();
    res.status(200).json({ success: true, message: "Removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update Quantity
export const updateCartItemQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity == null || quantity < 0) {
    return res.status(400).json({ success: false, message: "Valid product ID and quantity are required." });
  }

  try {
    const user = await User.findById(userId);
    const index = user.cart.findIndex(item => item.product.toString() === productId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    if (quantity === 0) {
      user.cart.splice(index, 1);
    } else {
      user.cart[index].quantity = quantity;
    }

    await user.save();
    res.status(200).json({ success: true, message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Clear Entire Cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
