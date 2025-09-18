// controllers/paymentController.js
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";
import Products from "../models/Products.js";
import { sendOrderSuccessMail } from "../services/email/sender.js";
import { generateInvoice } from "../services/invoice/generateInvoice.js";
import Vendor from "../models/Vendor.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================
// Create Razorpay order for Online Payment
// ==========================
export const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ success: false, message: "Invalid order information." });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

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
    res.status(500).json({ success: false, message: "Unable to create payment order.", error: err.message });
  }
};

// ==========================
// Verify Razorpay payment signature
// ==========================
export const verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, shippingInfo } = req.body;

  if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({ success: false, message: "Invalid payment information." });
  }

  try {
    const order = await Order.findById(orderId).populate("orderItems.product", "title price createdBy");
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (order.user.toString() !== req.person.id) {
      return res.status(403).json({ success: false, message: "Not authorized for this order." });
    }

    // Verify Razorpay signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Payment verification failed." });
    }

    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not captured." });
    }

    const expectedAmount = Math.round(order.totalAmount * 100);
    if (payment.amount !== expectedAmount) {
      return res.status(400).json({ success: false, message: "Payment amount mismatch." });
    }

    const user = await User.findById(order.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Update order
    order.paymentMethod = "Online";
    order.paymentInfo = { id: razorpayPaymentId, status: "paid" };
    order.paidAt = new Date();
    order.orderStatus = "processing";
    if (shippingInfo) order.shippingInfo = shippingInfo;

    // Deduct stock
    for (const item of order.orderItems) {
      await Products.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, unitsSold: item.quantity },
      });
    }

    // Clear cart
    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    // Invoice number
    if (!order.invoiceNumber) {
      order.invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${order._id}`;
    }

    // Generate customer invoice
    const customerInvoice = await generateInvoice(order, null, user, "customer");
    order.userInvoiceUrl = customerInvoice?.url || "";

    // Generate vendor invoices (multi-vendor)
    const vendorGroups = {};
    for (const item of order.orderItems) {
      const vendorId = item.product?.createdBy?.toString();
      if (!vendorId) continue;
      if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
      vendorGroups[vendorId].push(item);
    }

    const vendorInvoices = [];
    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) continue;

        const result = await generateInvoice(
          { ...order.toObject(), orderItems: items },
          vendor,
          user,
          "vendor"
        );

        vendorInvoices.push({ vendorId, invoiceUrl: result?.url || "" });
      } catch (err) {
        console.error(`Invoice generation failed for vendor ${vendorId}:`, err);
      }
    }
    order.vendorInvoices = vendorInvoices;
    await order.save();

    // Send order success email
    try {
      await sendOrderSuccessMail({
        to: user?.email,
        orderId: order._id,
        customerName: user?.name,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        items: order.orderItems.map((i) => ({
          name: i.product?.title || "Unknown product",
          qty: i.quantity,
          price: i.product?.price ?? 0,
        })),
        invoiceUrl: order.userInvoiceUrl,
      });
    } catch (mailErr) {
      console.error("Order placed but failed to send email:", mailErr);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed.",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to verify payment." });
  }
};

// ==========================
// Confirm COD Payment (with multi-vendor invoices)
// ==========================
export const confirmCOD = async (req, res) => {
  const { orderId, shippingInfo } = req.body;

  if (!orderId || !shippingInfo) {
    return res.status(400).json({ success: false, message: "Order and shipping info required." });
  }

  try {
    const order = await Order.findById(orderId).populate("orderItems.product", "title price createdBy");
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (order.paymentInfo?.status === "paid") {
      return res.status(400).json({ success: false, message: "Order is already paid." });
    }

    const user = await User.findById(order.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    order.shippingInfo = shippingInfo;
    order.paymentMethod = "COD";
    order.paymentInfo = { id: null, status: "pending" };
    order.orderStatus = "processing";

    // Deduct stock
    for (const item of order.orderItems) {
      await Products.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, unitsSold: item.quantity },
      });
    }

    // Clear cart
    if (order.source === "cart") {
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
    }

    // Invoice number
    if (!order.invoiceNumber) {
      order.invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${order._id}`;
    }

    // Generate customer invoice
    const customerInvoice = await generateInvoice(order, null, user, "customer");
    order.userInvoiceUrl = customerInvoice?.url || "";

    // Generate vendor invoices
    const vendorGroups = {};
    for (const item of order.orderItems) {
      const vendorId = item.product?.createdBy?.toString();
      if (!vendorId) continue;
      if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
      vendorGroups[vendorId].push(item);
    }

    const vendorInvoices = [];
    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      try {
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) continue;

        const result = await generateInvoice(
          { ...order.toObject(), orderItems: items },
          vendor,
          user,
          "vendor"
        );

        vendorInvoices.push({ vendorId, invoiceUrl: result?.url || "" });
      } catch (err) {
        console.error(`Invoice generation failed for vendor ${vendorId}:`, err);
      }
    }
    order.vendorInvoices = vendorInvoices;
    await order.save();

    // Send order success email
    try {
      await sendOrderSuccessMail({
        to: user?.email,
        orderId: order._id,
        customerName: user?.name,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        items: order.orderItems.map((i) => ({
          name: i.product?.title || "Unknown product",
          qty: i.quantity,
          price: i.product?.price || 0,
        })),
        invoiceUrl: order.userInvoiceUrl,
      });
    } catch (error) {
      console.error("Order placed but failed to send email:", error);
    }

    res.status(200).json({
      success: true,
      message: "COD confirmed and order is processing.",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to confirm COD.", error: err.message });
  }
};