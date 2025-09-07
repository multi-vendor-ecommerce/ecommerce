// controllers/paymentController.js
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";
import Products from "../models/Products.js";
import { sendOrderSuccessMail } from "../services/email/sender.js";

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

    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not completed. Please try again." });
    }

    if (payment.amount !== Math.round(payment.amount / 100) * 100) {
      return res.status(400).json({ success: false, message: "Payment amount mismatch. Please contact support." });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found. Please check your order." });

    // Fetch user for email
    const user = await User.findById(order.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    order.paymentMethod = "Online";
    order.paymentInfo = { id: razorpayPaymentId, status: "paid" };
    order.paidAt = new Date();
    order.orderStatus = "processing";

    if (shippingInfo) {
      order.shippingInfo = shippingInfo;
    }

    for (const item of order.orderItems) {
      await Products.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, unitsSold: item.quantity } }
      );
    }

    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    if (order.user.toString() !== req.person.id) {
      return res.status(403).json({ success: false, message: "Not authorized for this order." });
    }

    await order.save();

    await sendOrderSuccessMail({
      to: user.email,
      orderId: order._id,
      customerName: user.name,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      items: order.orderItems.map(i => ({
        name: i.productName,
        qty: i.quantity,
        price: i.price,
      })),
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed.",
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to verify payment. Please try again." });
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

    const user = await User.findById(order.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });


    order.shippingInfo = shippingInfo;
    order.paymentMethod = "COD";
    order.paymentInfo = { id: null, status: "pending" };
    order.orderStatus = "processing";

    for (const item of order.orderItems) {
      await Products.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, unitsSold: item.quantity } }
      );
    }

    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    await order.save();

    // Send confirmation email for COD
    await sendOrderSuccessMail({
      to: user.email,
      orderId: order._id,
      customerName: user.name,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      items: order.orderItems.map(i => ({
        name: i.productName,
        qty: i.quantity,
        price: i.price,
      })),
    });

    console.log("COD order confirmed and email sent.");

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