import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Products.js";
import Vendor from "../models/Vendor.js";
import buildQuery from "../utils/queryBuilder.js";
import { getShippingInfoForOrder } from "../utils/getShippingInfo.js";

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
    let itemPrice = 0;
    let tax = 0;
    let shippingCharges = 0;
    let draftOrder;

    if (buyNow) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: "Selected product is unavailable." });

      orderItems = [{ product: product._id, quantity, color, size }];
      itemPrice = product.price * quantity;
      tax = itemPrice * 0.18;
      shippingCharges = product.freeDelivery ? 0 : 50;

      draftOrder = await Order.findOne({
        user: userId,
        orderStatus: "pending",
        source: "buyNow",
        "orderItems.product": product._id
      });
      if (draftOrder) {
        draftOrder.orderItems = orderItems;
        draftOrder.itemPrice = itemPrice;
        draftOrder.tax = tax;
        draftOrder.shippingCharges = shippingCharges;
        draftOrder.totalAmount = itemPrice + tax + shippingCharges;
        draftOrder.shippingInfo = shippingInfo;
        await draftOrder.save();
      } else {
        draftOrder = await Order.create({
          user: userId,
          orderItems,
          shippingInfo,
          itemPrice,
          tax,
          shippingCharges,
          totalAmount: itemPrice + tax + shippingCharges,
          orderStatus: "pending",
          source: "buyNow",
        });
      }
    } else {
      // Cart case
      if (!user.cart.length) return res.status(400).json({ success: false, message: "Your cart is empty." });
      orderItems = user.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      }));
      itemPrice = user.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      tax = itemPrice * 0.18;
      shippingCharges = user.cart.some(i => !i.product.freeDelivery) ? 50 : 0;

      draftOrder = await Order.findOne({ user: userId, orderStatus: "pending", source: "cart" });
      if (draftOrder) {
        draftOrder.orderItems = orderItems;
        draftOrder.itemPrice = itemPrice;
        draftOrder.tax = tax;
        draftOrder.shippingCharges = shippingCharges;
        draftOrder.totalAmount = itemPrice + tax + shippingCharges;
        draftOrder.shippingInfo = shippingInfo;
        await draftOrder.save();
      } else {
        draftOrder = await Order.create({
          user: userId,
          orderItems,
          shippingInfo,
          itemPrice,
          tax,
          shippingCharges,
          totalAmount: itemPrice + tax + shippingCharges,
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
        query["orderItems.product.createdBy"] = req.query.vendorId;
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

    const [orders, total] = await Promise.all([
      Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
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

    const order = await Order.findById(req.params.id)
      .populate({
        path: "orderItems.product",
        select: "title price createdBy",
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