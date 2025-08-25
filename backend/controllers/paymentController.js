// controllers/paymentController.js
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay order for Online Payment
export const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.orderStatus !== "pending") {
      return res.status(400).json({ success: false, message: "Order already confirmed" });
    }

    const options = {
      amount: Math.round(order.totalAmount * 100), 
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Frontend should open Razorpay checkout using this info
    res.status(200).json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs this key
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

// 2. Verify Razorpay payment signature
export const verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, shippingInfo } = req.body;

  try {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Update order to mark it paid
    order.paymentMethod = "Online";
    order.paymentInfo = { id: razorpayPaymentId, status: "paid" };
    order.paidAt = new Date();
    order.orderStatus = "processing";

    if (shippingInfo) {
      order.shippingInfo = shippingInfo;
    }

    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    await order.save();

    res.status(200).json({ success: true, message: "Payment verified successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// 3. Confirm COD Payment
export const confirmCOD = async (req, res) => {
  const { orderId, shippingInfo } = req.body;
  if (!shippingInfo) {
    return res.status(400).json({ success: false, message: "shippingInfo is required for COD confirmation" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.paymentInfo?.status === "paid") {
      return res.status(400).json({ success: false, message: "Order already paid" });
    }

    // Update shippingInfo if provided
    if (shippingInfo) {
      order.shippingInfo = shippingInfo;
    }

    order.paymentMethod = "COD";
    order.paymentInfo = { id: null, status: "pending" };
    order.orderStatus = "processing"; 

    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    await order.save();

    res.status(200).json({ success: true, message: "COD confirmed", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "COD confirmation failed" });
  }
};
