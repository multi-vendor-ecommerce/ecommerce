import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";
import { getShippingInfoForOrder } from "../utils/getShippingInfo.js";

export const createOrUpdateDraftOrder = async (req, res) => {
  const userId = req.person.id;
  const { buyNow, productId, quantity = 1, color, size } = req.body;

  try {
    const user = await User.findById(userId).populate("cart.product").select("cart address name phone");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const shippingInfo = await getShippingInfoForOrder(user);

    let orderItems = [];
    let itemPrice = 0;
    let tax = 0;
    let shippingCharges = 0;
    let draftOrder;

    if (buyNow) {
      if (!productId) return res.status(400).json({ success: false, message: "Product ID required" });
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });

      orderItems = [{ product: product._id, quantity, color, size }];
      itemPrice = product.price * quantity;
      tax = itemPrice * 0.18;
      shippingCharges = product.freeDelivery ? 0 : 50;

      // Check existing draft for this product
      draftOrder = await Order.findOne({ user: userId, orderStatus: "draft", source: "buyNow", "orderItems.product": productId });
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
          orderStatus: "draft",
          source: "buyNow",
        });
      }
    } else {
      // Cart case
      if (!user.cart.length) return res.status(400).json({ success: false, message: "Cart is empty" });
      orderItems = user.cart.map(item => ({ product: item.product._id, quantity: item.quantity, color: item.color, size: item.size }));
      itemPrice = user.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      tax = itemPrice * 0.18;
      shippingCharges = user.cart.some(i => !i.product.freeDelivery) ? 50 : 0;

      draftOrder = await Order.findOne({ user: userId, orderStatus: "draft", source: "cart" });
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
          orderStatus: "draft",
          source: "cart",
        });
      }
    }

    return res.status(201).json({ success: true, message: "Draft order created/updated", draftId: draftOrder._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const role = req.person.role;
    let query = {};
    
    // Build query for status, paymentStatus, orderId for all roles
    query = buildQuery(req.query, ["status", "paymentStatus", "orderId"]);

    if (role === "customer") {
      // Customers: only their own orders, but can filter by status/paymentStatus/orderId
      query.user = req.person.id;
    } else {
      // Admin and vendor: build query from params
      if (role === "admin" && req.query.vendorId) {
        query["orderItems.product.createdBy"] = req.query.vendorId;
      } else if (role === "vendor") {
        // Get all orders, then filter in JS after population
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

        // Only keep orders where at least one product was created by this vendor
        const vendorOrders = allOrders.filter(order =>
          order.orderItems.some(
            item =>
              item.product &&
              item.product.createdBy &&
              item.product.createdBy._id.toString() === req.person.id.toString()
          )
        );

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const paginatedOrders = vendorOrders.slice(skip, skip + limit);

        return res.status(200).json({
          success: true,
          message: "Orders fetched successfully.",
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
      message: "Orders fetched successfully.",
      orders,
      total,
      page,
      limit,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Get a single order by ID – supports admin and vendor access
export const getOrderById = async (req, res) => {
  try {
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

    // 🔒 Access control: Customer can only access their own order
    if (
      req.person.role === "customer" &&
      order.user &&
      order.user._id.toString() !== req.person.id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied: Not your order." });
    }

    // 🔒 Access control: Vendor can only access their own order
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
      return res.status(403).json({ success: false, message: "Access denied: Not your order." });
    }

    res.status(200).send({
      success: true,
      message: "Order fetched successfully.",
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// Get a draft order for a user (for review)
export const getUserDraftOrder = async (req, res) => {
  try {
    const { id } = req.params; // draft order ID
    const userId = req.person.id;

    const order = await Order.findOne({ _id: id, user: userId, orderStatus: "draft" })
      .populate({ path: "orderItems.product", select: "title price images" });

    if (!order) {
      return res.status(404).json({ success: false, message: "Draft order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};