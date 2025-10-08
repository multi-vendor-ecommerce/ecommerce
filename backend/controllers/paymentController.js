// controllers/paymentController.js
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";
import Products from "../models/Products.js";
import Vendor from "../models/Vendor.js";
import { sendOrderSuccessMail } from "../services/email/sender.js";
import { generateInvoice } from "../services/customerInvoice/generateInvoice.js";
import { safeSendMail } from "../utils/safeSendMail.js";
import { pushOrderToShiprocket } from "../services/shiprocket/order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================
// Create Razorpay order
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
      amount: Math.round(order.grandTotal * 100),
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
// Verify Razorpay payment
// ==========================
export const verifyRazorpayPayment = async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, shippingInfo } = req.body;

  if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({ success: false, message: "Invalid payment information." });
  }

  try {
    const order = await Order.findById(orderId)
      .populate("orderItems.product", "title price createdBy hsnCode gstRate");

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

    // compute expectedAmount first
    const expectedAmount = Math.round(order.grandTotal * 100);

    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpayPaymentId);
    } catch (err) {
      console.error("Failed to fetch Razorpay payment:", err);
      return res.status(500).json({ success: false, message: "Unable to fetch payment details." });
    }

    // If not captured, handle authorized → capture
    if (payment.status !== "captured") {
      if (payment.status === "authorized") {
        try {
          await razorpay.payments.capture(razorpayPaymentId, expectedAmount, "INR");
          payment = await razorpay.payments.fetch(razorpayPaymentId); // refetch
        } catch (captureErr) {
          console.error("Razorpay capture failed:", captureErr);
          return res.status(500).json({ success: false, message: "Payment capture failed." });
        }
      } else {
        return res.status(400).json({ success: false, message: "Payment not captured." });
      }
    }

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
      const product = await Products.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product?.title || "Product"} is out of stock.`,
        });
      }

      // Safe update
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

    // Save order first (before async tasks)
    await order.save();

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed.",
      order,
    });
    
    // Async post-processing (emails, invoice, Shiprocket)
    (async () => {
      try {
        // Shiprocket push
        try {
          await pushOrderToShiprocket(order._id);
          console.log("Shiprocket orders created for all vendors");
        } catch (err) {
          console.error("Shiprocket push failed:", err.message);
        }

        // Generate invoice
        const customerInvoice = await generateInvoice(order, user);
        order.userInvoiceUrl = customerInvoice?.url || "";
        await order.save();

        // Customer email
        try {
          await safeSendMail(sendOrderSuccessMail, {
            to: user?.email,
            orderId: order._id,
            customerName: user?.name,
            paymentMethod: order.paymentMethod,
            totalAmount: order.grandTotal,
            items: order.orderItems.map((i) => ({
              name: i.product?.title || "Unknown product",
              qty: i.quantity,
              price: i.product?.price ?? 0,
            })),
            invoiceUrl: order.userInvoiceUrl,
          });
        } catch (err) {
          console.error("Failed to send customer email:", err);
        }

        // Vendor emails
        const vendorGroups = {};
        for (const item of order.orderItems) {
          const vendorId = item.product?.createdBy?.toString();
          if (!vendorId) continue;
          if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
          vendorGroups[vendorId].push(item);
        }

        for (const [vendorId, items] of Object.entries(vendorGroups)) {
          const vendor = await Vendor.findById(vendorId);
          if (!vendor) continue;

          try {
            await safeSendMail(sendOrderSuccessMail, {
              to: vendor.email,
              orderId: order._id,
              customerName: user?.name,
              paymentMethod: order.paymentMethod,
              totalAmount: items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0),
              items: items.map(i => ({
                name: i.product?.title || "Unknown product",
                qty: i.quantity,
                price: i.product?.price ?? 0,
              })),
              vendorName: vendor.name,
              vendorShop: vendor.shopName,
              isVendor: true,
            });
          } catch (err) {
            console.error(`Failed to send vendor email for ${vendorId}:`, err);
          }
        }
      } catch (err) {
        console.error("Async post-processing failed:", err);
      }
    })();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to verify payment." });
  }
};

// ==========================
// Confirm COD payment
// ==========================
export const confirmCOD = async (req, res) => {
  const { orderId, shippingInfo } = req.body;

  if (!orderId || !shippingInfo) {
    return res.status(400).json({ success: false, message: "Order and shipping info required." });
  }

  try {
    const order = await Order.findById(orderId)
      .populate("orderItems.product", "title price createdBy hsnCode gstRate");
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
      const product = await Products.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product?.title || "Product"} is out of stock.`,
        });
      }
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

    // Save order first
    await order.save();

    // Send response immediately so frontend loader stops
    res.status(200).json({
      success: true,
      message: "COD confirmed and order is processing.",
      order,
    });

    // Async post-processing (emails, invoice, Shiprocket)
    (async () => {
      try {
        await pushOrderToShiprocket(order._id);
        const customerInvoice = await generateInvoice(order, user);
        order.userInvoiceUrl = customerInvoice?.url || "";
        await order.save();

        await safeSendMail(sendOrderSuccessMail, {
          to: user?.email,
          orderId: order._id,
          customerName: user?.name,
          paymentMethod: order.paymentMethod,
          totalAmount: order.grandTotal,
          items: order.orderItems.map((i) => ({
            name: i.product?.title || "Unknown product",
            qty: i.quantity,
            price: i.product?.price || 0,
          })),
          invoiceUrl: order.userInvoiceUrl,
        });

        const vendorGroups = {};
        for (const item of order.orderItems) {
          const vendorId = item.product?.createdBy?.toString();
          if (!vendorId) continue;
          if (!vendorGroups[vendorId]) vendorGroups[vendorId] = [];
          vendorGroups[vendorId].push(item);
        }

        for (const [vendorId, items] of Object.entries(vendorGroups)) {
          const vendor = await Vendor.findById(vendorId);
          if (!vendor) continue;

          try {
            await safeSendMail(sendOrderSuccessMail, {
              to: vendor.email,
              orderId: order._id,
              customerName: user?.name,
              paymentMethod: order.paymentMethod,
              totalAmount: items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0),
              items: items.map(i => ({
                name: i.product?.title || "Unknown product",
                qty: i.quantity,
                price: i.product?.price ?? 0,
              })),
              vendorName: vendor.name,
              vendorShop: vendor.shopName,
              isVendor: true,
            });
          } catch (err) {
            console.error(`Failed to send vendor email for ${vendorId}:`, err);
          }
        }
      } catch (err) {
        console.error("Async post-processing failed:", err);
      }
    })();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to confirm COD.", error: err.message });
  }
};
