import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";
import { getShippingInfoForOrder } from "../utils/getShippingInfo.js";
import { round2 } from "../utils/round2.js";
import { getDateRange } from "../utils/getDateRange.js";
import { generateShippingDocs } from "../services/shiprocket/generateDocs.js";
import { pushOrderToShiprocket } from "../services/shiprocket/order.js";
import { cancelShiprocketOrders } from "../services/shiprocket/cancel.js";
import { returnOrderToShiprocket } from "../services/shiprocket/return.js";
import { assignAWBToOrder } from "../services/shiprocket/generateAwb.js";

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

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.title} is out of stock or only ${product.stock} left.`,
        });
      }

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

      for (let item of user.cart) {
        const product = item.product;
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `${product.title} is out of stock or only ${product.stock} left.`,
          });
        }
      }

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
// Get All Orders (role-based access & pagination) + totalRevenue
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
    query = buildQuery(req.query, ["paymentMethod"], ["orderStatus", "orderItems.shiprocketStatus"]);

    if (role === "customer") {
      query.user = req.person.id;
    } else if (role === "admin" && req.query.vendorId) {
      const vendorProducts = await Product.find({ createdBy: req.query.vendorId }).select("_id");
      const productIds = vendorProducts.map(p => p._id);
      query["orderItems.product"] = { $in: productIds };
    } else if (role === "vendor") {
      const allOrders = await Order.find(query)
        .sort({ createdAt: -1 })
        .populate({
          path: "orderItems.product",
          select: "title price images category brand createdBy",
          populate: { path: "createdBy", select: "name email shopName address phone" }
        })
        .populate({ path: "user", select: "name email address phone" });

      const vendorOrders = allOrders.filter(order =>
        order.orderItems.some(
          item => item.product && item.product.createdBy && item.product.createdBy._id.toString() === req.person.id.toString()
        )
      );

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const paginatedOrders = vendorOrders.slice(skip, skip + limit);

      // Calculate total revenue for vendor orders
      const totalRevenue = vendorOrders
        .filter(order => ["delivered", "shipped", "processing"].includes(order.orderStatus))
        .reduce((sum, order) => sum + (order.grandTotal || 0), 0);

      return res.status(200).json({
        success: true,
        message: "Orders loaded.",
        orders: paginatedOrders,
        total: vendorOrders.length,
        totalRevenue,
        page,
        limit,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let selectFields = "_id invoiceNumber createdAt orderStatus paymentMethod subTotal totalTax shippingCharges totalDiscount grandTotal orderItems shippingInfo user deliveredAt customNotes";
    if (role === "vendor") selectFields += "-userInvoiceUrl";
    if (role === "customer") selectFields += "-vendorInvoices";

    const [orders, total] = await Promise.all([
      Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select(selectFields)
        .populate({
          path: "orderItems.product",
          select: "title price images category brand createdBy",
          populate: { path: "createdBy", select: "name email shopName address phone" }
        })
        .populate({ path: "user", select: "name email address phone" }),
      Order.countDocuments(query),
    ]);

    // Calculate total revenue for the filtered orders (all matching, not just paginated)
    const totalRevenueAggregation = await Order.aggregate([
      { $match: query },
      { $match: { orderStatus: { $in: ["delivered", "shipped", "processing"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } }
    ]);

    const totalRevenue = totalRevenueAggregation[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      message: "Orders loaded.",
      orders,
      total,
      totalRevenue,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
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

// ==========================
// Get Sales Trend (admin & vendor)
// ==========================
export const getSalesTrend = async (req, res) => {
  try {
    const { role, id } = req.person;
    const { range = "7d" } = req.query;

    const { startDate, endDate } = getDateRange(range);

    const matchQuery = {
      orderStatus: "delivered",
      deliveredAt: { $gte: startDate, $lte: endDate },
    };

    if (role === "vendor") {
      matchQuery["orderItems.createdBy"] = id;
    }

    const trendData = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt" } },
          totalSales: { $sum: "$grandTotal" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const formattedTrend = trendData.map((item) => ({
      date: item._id,
      revenue: item.totalSales,
      orders: item.orderCount,
    }));

    res.status(200).json({
      success: true,
      message: "Sales trend fetched successfully",
      range,
      salesTrend: formattedTrend,
    });
  } catch (err) {
    console.error("Error fetching sales trend:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales trend",
      error: err.message,
    });
  }
};

// ==========================
// Push Vendor Items to Shiprocket
// ==========================
export const pushOrder = async (req, res) => {
  const { packageLength, packageBreadth, packageHeight, packageWeight } = req.body;
  const orderId = req.params.id;

  if (!orderId)
    return res.status(400).json({ success: false, message: "Order ID is required." });

  try {
    const order = await Order.findById(orderId).populate("orderItems.product");
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found." });

    const vendorId = req.person.id;

    const vendorItems = order.orderItems.filter(
      item => item.createdBy.toString() === vendorId
    );
    if (!vendorItems.length)
      return res.status(403).json({ success: false, message: "No items belong to you." });

    // Update packaging using arrayFilters
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "orderItems.$[item].packageLength": packageLength,
          "orderItems.$[item].packageBreadth": packageBreadth,
          "orderItems.$[item].packageHeight": packageHeight,
          "orderItems.$[item].packageWeight": packageWeight,
        }
      },
      {
        new: true,
        runValidators: true,
        arrayFilters: [{ "item.createdBy": vendorId }]
      }
    ).populate("orderItems.product");

    // Push vendor items to Shiprocket
    const pushedItems = await pushOrderToShiprocket(orderId, vendorId);

    res.status(200).json({
      success: true,
      message: "Order pushed successfully",
      status: "pending_awb",
      orderId: order._id,
      orderItems: updatedOrder.orderItems.filter(
        item => item.createdBy.toString() === vendorId
      ),
      pushedItems, // Optional: info returned from Shiprocket for vendor items
    });
  } catch (err) {
    console.error("Push order error:", err);
    res.status(500).json({ success: false, message: "Failed to push order.", error: err.message });
  }
};

// ==========================
// Generate AWB for Order (admin & vendor)
// ==========================
export const generateAWBForOrder = async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Order ID is required." });
  }

  try {
    const updatedOrder = await assignAWBToOrder(orderId);
    if (!updatedOrder.success) {
      return res.status(422).json({ success: false, message: updatedOrder.message });
    }
    return res.json({ success: true, message: "AWB assigned successfully. Documents generated.", order: updatedOrder });
  } catch (err) {
    console.error("Generate AWB error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate AWB.", error: err.message });
  }
};

// ==========================
// Generate Shipping Documents
// ==========================
export const generateOrderDocs = async (req, res) => {
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "Order ID is required." });
  }

  try {
    // Fetch order with product info
    const order = await Order.findById(orderId).populate("orderItems.product");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const { role, id: userId } = req.person;

    // Determine which items to process
    let itemsToGenerate = order.orderItems;

    // Vendor: only their own items
    if (role === "vendor") {
      itemsToGenerate = order.orderItems.filter(
        item => item.product?.createdBy?.toString() === userId
      );

      if (!itemsToGenerate.length) {
        return res.status(403).json({
          success: false,
          message: "No items in this order belong to you.",
        });
      }
    }

    // Only include items with AWB/shipment IDs
    const itemsWithAWB = itemsToGenerate.filter(
      item => item.awb || item.shiprocketShipmentId
    );

    if (!itemsWithAWB.length) {
      return res.status(400).json({
        success: false,
        message: "No AWB assigned for these items. Cannot generate documents.",
      });
    }

    // Extract shipmentIds / orderIds
    const shipmentIds = itemsWithAWB.map(i => i.shiprocketShipmentId);
    const orderIds = itemsWithAWB.map(i => i.shiprocketOrderId);

    // Call service to generate documents (pass filtered IDs)
    const updatedOrder = await generateShippingDocs(orderId, { shipmentIds, orderIds });

    res.status(200).json({
      success: true,
      message: "Shipping documents generated successfully.",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Generate shipping docs error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate shipping documents.",
      error: err.message,
    });
  }
};

// ==========================
// Cancel Order
// ==========================
export const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const { role, id: userId } = req.person;

  if (!orderId) return res.status(400).json({ success: false, message: "Order ID is required" });
  if (!["admin", "vendor", "customer"].includes(role)) {
    return res.status(403).json({ success: false, message: "Not allowed to cancel orders" });
  }

  try {
    const order = await Order.findById(orderId).populate("orderItems.product");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Normalize shiprocketStatus to lowercase before comparison
    order.orderItems.forEach(item => {
      if (item.shiprocketStatus) item.shiprocketStatus = item.shiprocketStatus.toLowerCase();
    });

    if (role === "admin") {
      const itemsToCancel = order.orderItems.filter(item => item.shiprocketStatus !== "cancelled");
      if (itemsToCancel.length) await cancelShiprocketOrders(itemsToCancel);
      order.orderStatus = "cancelled";
      await order.save();
      return res.status(200).json({ success: true, message: "Order cancelled successfully by admin", order });
    }

    if (role === "vendor") {
      const vendorItems = order.orderItems.filter(
        item => item.product.createdBy?.toString() === userId && item.shiprocketStatus !== "cancelled"
      );
      if (!vendorItems.length) return res.status(403).json({ success: false, message: "No cancellable items found" });

      await cancelShiprocketOrders(vendorItems);

      const allCancelled = order.orderItems.every(item => item.shiprocketStatus === "cancelled");
      if (allCancelled) order.orderStatus = "cancelled";

      await order.save();
      return res.status(200).json({
        success: true,
        message: allCancelled ? "Entire order cancelled successfully" : "Vendor's items cancelled successfully",
        order
      });
    }

    if (role === "customer") {
      if (order.user.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });
      if (!["pending", "processing"].includes(order.orderStatus)) return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });
      order.orderStatus = "cancelled";
      await order.save();
      return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
    }

    return res.status(403).json({ success: false, message: "Not allowed to cancel orders" });
  } catch (err) {
    console.error("Cancel order error:", err);
    return res.status(500).json({ success: false, message: "Failed to cancel order", error: err.message });
  }
};

// ==========================
// Return Order Request
// ==========================
export const returnOrderRequest = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { role, id: userId } = req.person;

    if (!["vendor", "admin"].includes(role)) {
      return res.status(403).json({ success: false, message: "Only vendors and admins can request returns for their orders." });
    }

    if (!orderId) return res.status(400).json({ success: false, message: "Order ID is required." });

    const order = await Order.findById(orderId).populate("orderItems.product");
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    const vendorId = role === "vendor" ? userId : null;

    const vendorItems = order.orderItems.filter(
      item => !vendorId || item.product.createdBy?.toString() === vendorId
    );

    // Normalize shiprocketStatus
    vendorItems.forEach(item => {
      if (item.shiprocketStatus) item.shiprocketStatus = item.shiprocketStatus.toLowerCase();
    });

    const anyUndelivered = vendorItems.some(item => item.shiprocketStatus !== "delivered");
    if (anyUndelivered) return res.status(400).json({ success: false, message: "You can only request returns for delivered items." });

    const result = await returnOrderToShiprocket(orderId, vendorId);
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to return order.", error: err.message });
  }
};