import User from "../models/User.js";
import Product from "../models/Products.js";

// Get Cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.person.id).populate({
      path: "cart.product",
      select: "_id title images price stock freeDelivery",
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const filteredCart = user.cart.map(({ _id, quantity, size, color, product }) => ({
      _id,
      quantity,
      color,
      size,
      product: {
        _id: product._id,
        title: product.title,
        images: product.images,
        price: product.price,
        stock: product.stock,
        freeDelivery: product.freeDelivery,
      },
    }));

    res.status(200).json({ success: true, cart: filteredCart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Add to Cart (also used for increase/decrease quantity)
export const addToCart = async (req, res) => {
  const userId = req.person.id;
  const { productId, quantity, color, size } = req.body;

  if (!productId || typeof quantity !== 'number') {
    return res.status(400).json({
      success: false,
      message: "Product ID and valid quantity are required.",
    });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.cart.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (index !== -1) {
      //  Product already in cart — adjust quantity
      user.cart[index].quantity += quantity;

      if (user.cart[index].quantity <= 0) {
        //  Remove item if quantity drops to 0 or below
        user.cart.splice(index, 1);
      }
    } else {
      //  Add new product only if quantity is positive
      if (quantity > 0) {
        user.cart.push({ product: productId, quantity, color, size });
      } else {
        return res.status(400).json({
          success: false,
          message: "Cannot add item with zero or negative quantity.",
        });
      }
    }

    await user.save();

    await user.populate({
      path: "cart.product",
      select: "_id title images price stock freeDelivery"
    });

    res.status(200).json({ success: true, message: "Cart updated", cart: user.cart });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  const userId = req.person.id;
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

// Clear Entire Cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.person.id);
    user.cart = [];
    await user.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
