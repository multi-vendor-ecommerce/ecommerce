import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Products.js";
import Vendor from "../models/Vendor.js";
import buildQuery from "../utils/queryBuilder.js";
import { getShippingInfoForOrder } from "../utils/getShippingInfo.js";
import { createVendorShiprocketOrder } from "../services/shiprocket/orders.js";
import { round2 } from "../utils/round2.js";

// ==========================
// Create or Update Draft Order
// ==========================
export const createOrUpdateDraftOrder = async (req, res) => {
  const userId = req.person.id;
  const { buyNow, productId, quantity = 1, color, size } = req.body;

  try {
    // Validate productId if present
    if (buyNow && (!productId || !mongoose.Types.ObjectId.isValid(productId))) {
      return res.status(400).json({ success: false, message: "Invalid product information." });
    }

    const user = await User.findById(userId).populate("cart.product").select("cart address name phone");

    if (!user) return res.status(404).json({ success: false, message: "Unable to process order." });

    const shippingInfo = await getShippingInfoForOrder(user);

    let orderItems = [];
    let shippingCharges = 0;
    let draftOrder;
    let subTotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    if (buyNow) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: "Selected product is unavailable." });

      const originalPrice = round2(product.price);
      const discountPercent = product.discount || 0;
      const discountAmount = round2((originalPrice * discountPercent) / 100);

      const basePrice = round2(originalPrice - discountAmount);
      const gstRate = product.gstRate;
      const gstAmount = round2((basePrice * gstRate) / 100);
      const totalPrice = round2(basePrice + gstAmount);

      orderItems = [
        {
          product: product._id,
          createdBy: product.createdBy,
          quantity,
          color,
          size,
          originalPrice,
          discountPercent,
          discountAmount,
          basePrice,
          gstRate,
          gstAmount,
          totalPrice,


        },
      ];

      subTotal = round2(totalPrice * quantity);
      totalTax = round2(gstAmount * quantity);
      shippingCharges = product.freeDelivery ? 0 : 50;
      totalDiscount = round2(discountAmount * quantity);

      draftOrder = await Order.findOne({
        user: userId,
        orderStatus: "pending",
        source: "buyNow",
        "orderItems.product": product._id
      });

      if (draftOrder) {
        draftOrder.orderItems = orderItems;
        draftOrder.subTotal = subTotal;
        draftOrder.totalTax = totalTax;
        draftOrder.shippingCharges = shippingCharges;
        draftOrder.grandTotal = round2(subTotal + shippingCharges);
        draftOrder.shippingInfo = shippingInfo;
        draftOrder.totalDiscount = totalDiscount;
        await draftOrder.save();
      } else {
        draftOrder = await Order.create({
          user: userId,
          orderItems,
          shippingInfo,
          subTotal,
          totalTax,
          shippingCharges,
          totalDiscount,
          grandTotal: round2(subTotal + shippingCharges),
          orderStatus: "pending",
          source: "buyNow",
        });
      }
    } else {
      // Cart case
      if (!user.cart.length) return res.status(400).json({ success: false, message: "Your cart is empty." });

      orderItems = user.cart.map((item) => {
        const product = item.product;
        const originalPrice = round2(product.price);
        const discountPercent = product.discount || 0;
        const discountAmount = round2((originalPrice * discountPercent) / 100);

        const basePrice = round2(originalPrice - discountAmount);
        const gstRate = product.gstRate;
        const gstAmount = round2((basePrice * gstRate) / 100);
        const totalPrice = round2(basePrice + gstAmount);

        subTotal += totalPrice * item.quantity;
        totalTax += gstAmount * item.quantity;
        totalDiscount += discountAmount * item.quantity;

        return {
          product: product._id,
          createdBy: product.createdBy, 
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          originalPrice,
          discountPercent,
          discountAmount,
          basePrice,
          gstRate,
          gstAmount,
          totalPrice,
        };
      });
      subTotal = round2(subTotal);
      totalTax = round2(totalTax);
      totalDiscount = round2(totalDiscount);
      shippingCharges = user.cart.some((i) => !i.product.freeDelivery) ? 50 : 0;

      draftOrder = await Order.findOne({ user: userId, orderStatus: "pending", source: "cart" });

      if (draftOrder) {
        draftOrder.orderItems = orderItems;
        draftOrder.subTotal = subTotal;
        draftOrder.totalTax = totalTax;
        draftOrder.shippingCharges = shippingCharges;
        draftOrder.grandTotal = round2(subTotal + shippingCharges);
        draftOrder.totalDiscount = totalDiscount;
        draftOrder.shippingInfo = shippingInfo;
        await draftOrder.save();
      } else {
        draftOrder = await Order.create({
          user: userId,
          orderItems,
          shippingInfo,
          subTotal,
          totalTax,
          shippingCharges,
          grandTotal: round2(subTotal + shippingCharges),
          totalDiscount,
          orderStatus: "pending",
          source: "cart",
        });
      }
    }
    return res.status(201).json({ success: true, message: "Draft order saved.", draftId: draftOrder._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Unable to save draft order.", error: err.message });
  }
};

// ==========================
// Get a Draft Order for a User
// ==========================
export const getUserDraftOrder = async (req, res) => {
  try {
    // Validate draft order ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid draft order information." });
    }

    const userId = req.person.id;
    const order = await Order.findOne({ _id: req.params.id, user: userId, orderStatus: "pending" })
      .populate({ path: "orderItems.product", select: "title price images" });

    if (!order) {
      return res.status(404).json({ success: false, message: "Draft order not found." });
    }

    res.status(200).json({ success: true, message: "Draft order loaded.", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load draft order.", error: err.message });
  }
};

// ==========================
// Get All Orders (role-based access & pagination)
// ==========================
export const getAllOrders = async (req, res) => {
  try {
    const role = req.person.role;
    let query = {};

    // Validate vendorId if present
    if (role === "admin" && req.query.vendorId && !mongoose.Types.ObjectId.isValid(req.query.vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor information." });
    }

    // Build query for status and paymentMethod only
    query = buildQuery(req.query, ["paymentMethod"], "orderStatus");

    if (role === "customer") {
      query.user = req.person.id;
    } else {
      if (role === "admin" && req.query.vendorId) {
        const vendorProducts = await Product.find({ createdBy: req.query.vendorId }).select("_id");
        const productIds = vendorProducts.map(p => p._id);

        const testOrders = await Order.find({ "orderItems.product": { $in: productIds } });

        query["orderItems.product"] = { $in: productIds };
      } else if (role === "vendor") {
        const allOrders = await Order.find(query)
          .sort({ createdAt: -1 })
          .populate({
            path: "orderItems.product",
            select: "title price images category brand createdBy",
            populate: {
              path: "createdBy",
              select: "name email shopName address phone"
            }
          })
          .populate({ path: "user", select: "name email address phone" });

        const vendorOrders = allOrders.filter(order =>
          order.orderItems.some(
            item =>
              item.product &&
              item.product.createdBy &&
              item.product.createdBy._id.toString() === req.person.id.toString()
          )
        );

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const paginatedOrders = vendorOrders.slice(skip, skip + limit);

        return res.status(200).json({
          success: true,
          message: "Orders loaded.",
          orders: paginatedOrders,
          total: vendorOrders.length,
          page,
          limit,
        });
      }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let selectFields = "_id invoiceNumber createdAt orderStatus paymentMethod subTotal totalTax shippingCharges totalDiscount grandTotal orderItems shippingInfo user deliveredAt customNotes";
    if (role === "vendor") {
      // Vendor cannot see userInvoiceUrl
      selectFields += "-userInvoiceUrl";
    } else if (role === "admin") {
      // Admin sees all fields (no exclusion)
    } else if (role === "customer") {
      // Customer cannot see vendorInvoices
      selectFields += "-vendorInvoices";
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select(selectFields)
        .populate({
          path: "orderItems.product",
          select: "title price images category brand createdBy",
          populate: {
            path: "createdBy",
            select: "name email shopName address phone"
          }
        })
        .populate({ path: "user", select: "name email address phone" }),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Orders loaded.",
      orders,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load orders.", error: err.message });
  }
};

// ==========================
// Get a Single Order by ID (admin & vendor access)
// ==========================
export const getOrderById = async (req, res) => {
  try {
    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order information." });
    }

    let selectFields = "_id invoiceNumber createdAt orderStatus paymentMethod source subTotal totalTax shippingCharges totalDiscount grandTotal orderItems shippingInfo user vendorInvoices deliveredAt customNotes userInvoiceUrl";
    if (req?.person.role === "vendor") {
      selectFields += "-userInvoiceUrl";
    } else if (req?.person.role === "customer") {
      selectFields += "-vendorInvoices";
    }

    const order = await Order.findById(req.params.id)
      .select(selectFields)
      .populate({
        path: "orderItems.product",
        select: "title price createdBy images",
        populate: {
          path: "createdBy",
          select: "name email address phone shopName"
        }
      })
      .populate({ path: "user", select: "name email address phone" });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Access control: Customer can only access their own order
    if (
      req.person.role === "customer" &&
      order.user &&
      order.user._id.toString() !== req.person.id.toString()
    ) {
      return res.status(403).json({ success: false, message: "You do not have permission to view this order." });
    }

    // Access control: Vendor can only access their own order
    if (
      req.person.role === "vendor" &&
      !order.orderItems.some(
        item =>
          item.product &&
          item.product.createdBy &&
          item.product.createdBy._id &&
          item.product.createdBy._id.toString() === req.person.id.toString()
      )
    ) {
      return res.status(403).json({ success: false, message: "You do not have permission to view this order." });
    }

    if (req.person.role === "vendor" && order.vendorInvoices && Array.isArray(order.vendorInvoices)) {
      order.vendorInvoices = order.vendorInvoices.filter(
        vi => vi.vendorId?.toString() === req.person.id.toString() ||
              (vi.vendorId?._id && vi.vendorId._id.toString() === req.person.id.toString())
      );
    }

    res.status(200).send({
      success: true,
      message: "Order loaded.",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to load order.", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.person.id;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Only allow cancel if status is pending or processing
    if (!["pending", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};