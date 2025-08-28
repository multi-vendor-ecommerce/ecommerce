// controllers/paymentController.js
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================
// Create Razorpay order for Online Payment
// ==========================
export const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  // Validate orderId
  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ success: false, message: "Invalid order information." });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found. Please check your order." });

    if (order.orderStatus !== "pending") {
      return res.status(400).json({ success: false, message: "Order is already confirmed or processed." });
    }

    const options = {
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Razorpay order created. Proceed to payment.",
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create payment order. Please try again.", error: err.message });
  }
};

// ==========================
// Verify Razorpay payment signature
// ==========================
export const verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, shippingInfo } = req.body;

  // Basic validation
  if (
    !orderId ||
    typeof orderId !== "string" ||
    !razorpayPaymentId ||
    typeof razorpayPaymentId !== "string" ||
    !razorpayOrderId ||
    typeof razorpayOrderId !== "string" ||
    !razorpaySignature ||
    typeof razorpaySignature !== "string"
  ) {
    return res.status(400).json({ success: false, message: "Invalid payment information." });
  }

  try {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Signature mismatch." });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found. Please check your order." });

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

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed.",
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to verify payment. Please try again.", error: err.message });
  }
};

// ==========================
// Confirm COD Payment
// ==========================
export const confirmCOD = async (req, res) => {
  const { orderId, shippingInfo } = req.body;

  // Validate orderId and shippingInfo
  if (!orderId || typeof orderId !== "string" || !shippingInfo) {
    return res.status(400).json({ success: false, message: "Order and shipping information required for COD confirmation." });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found. Please check your order." });

    if (order.paymentInfo?.status === "paid") {
      return res.status(400).json({ success: false, message: "Order is already paid." });
    }

    order.shippingInfo = shippingInfo;
    order.paymentMethod = "COD";
    order.paymentInfo = { id: null, status: "pending" };
    order.orderStatus = "processing";

    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "COD confirmed and order is processing.",
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to confirm COD. Please try again.", error: err.message });
  }
};