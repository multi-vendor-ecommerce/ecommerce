import User from "../models/User.js";
import Product from "../models/Products.js";

// ==========================
// Get Cart
// ==========================
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.person.id).populate({
      path: "cart.product",
      select: "_id title images price discount stock freeDelivery",
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Unable to retrieve cart." });
    }

    const filteredCart = user.cart.map(({ _id, quantity, size, color, product }) => ({
      _id,
      quantity,
      color,
      size,
      product: {
        _id: product._id,
        title: product.title,
        image: product.images[0] || null,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        freeDelivery: product.freeDelivery,
      },
    }));

    return res.status(200).json({
      success: true,
      cart: filteredCart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    return res.status(500).json({ success: false, message: "Could not fetch cart.", error: error.message });
  }
};

// ==========================
// Add to Cart (also handles quantity update)
// ==========================
export const addToCart = async (req, res) => {
  const userId = req.person.id;
  const { productId, quantity, color, size } = req.body;

  if (!productId || typeof quantity !== 'number') {
    return res.status(400).json({
      success: false,
      message: "Invalid product or quantity.",
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not available." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Unable to update cart." });
    }

    const index = user.cart.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (index !== -1) {
      user.cart[index].quantity += quantity;
      if (user.cart[index].quantity <= 0) {
        user.cart.splice(index, 1);
      }
    } else {
      if (quantity > 0) {
        user.cart.push({ product: productId, quantity, color, size });
      } else {
        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than zero.",
        });
      }
    }

    await user.save();
    await user.populate({
      path: "cart.product",
      select: "_id title images price stock freeDelivery"
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart: user.cart
    });
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to update cart.", error: error.message });
  }
};

// ==========================
// Remove from Cart
// ==========================
export const removeFromCart = async (req, res) => {
  const userId = req.person.id;
  const { cartItemId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Unable to update cart." });
    }

    const originalLength = user.cart.length;
    user.cart = user.cart.filter(item => item._id.toString() !== cartItemId);

    if (user.cart.length === originalLength) {
      return res.status(404).json({ success: false, message: "Cart item not found." });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: user.cart
    });
  } catch (error) {
    console.error("Remove from Cart Error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to remove item from cart.", error: error.message });
  }
};

// ==========================
// Clear Entire Cart
// ==========================
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.person.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Unable to clear cart." });
    }
    user.cart = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      cart: user.cart
    });
  } catch (error) {
    console.error("Clear Cart Error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to clear cart.", error: error.message });
  }
};