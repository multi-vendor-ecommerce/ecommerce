import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Products.js";

export const placeOrder = async (req, res) => {
  const userId = req.user.id;
  console.log("req.user", req.user);

  try {
    const user = await User.findById(userId).populate("cart.product");
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const ordersByVendor = {};
    user.cart.forEach(item => {
      const vendorId = item.product.vendorId.toString();
      if (!ordersByVendor[vendorId]) ordersByVendor[vendorId] = [];
      ordersByVendor[vendorId].push(item);
    });

    const createdOrders = [];

    for (const vendorId in ordersByVendor) {
      const products = ordersByVendor[vendorId].map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      }));

      const totalAmount = products.reduce((acc, item) => acc + item.quantity * item.priceAtPurchase, 0);

      const order = await Order.create({
        user: userId,
        vendor: vendorId,
        products,
        totalAmount,
        shippingAddress: user.address,
        paymentMethod: "COD",
      });

      createdOrders.push(order);
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ success: true, message: "Order placed successfully", orders: createdOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.product vendor");
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id }).populate("products.product user");
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
