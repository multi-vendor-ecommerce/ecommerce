import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Products.js";
import buildQuery from "../utils/queryBuilder.js";

// export const placeOrder = async (req, res) => {
//   const userId = req.person.id;
//   const { shippingInfo: shippingFromBody, paymentMethod } = req.body;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const user = await User.findById(userId)
//       .populate("cart.product")
//       .session(session);

//     if (!user || user.cart.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // Merge shipping info from frontend or user profile
//     const finalShippingInfo = {
//       recipientName: shippingFromBody?.recipientName || user.address?.recipientName,
//       recipientPhone: shippingFromBody?.recipientPhone || user.address?.recipientPhone,
//       line1: shippingFromBody?.line1 || user.address?.line1,
//       line2: shippingFromBody?.line2 || user.address?.line2 || "",
//       locality: shippingFromBody?.locality || user.address?.locality || "",
//       city: shippingFromBody?.city || user.address?.city,
//       state: shippingFromBody?.state || user.address?.state,
//       country: shippingFromBody?.country || user.address?.country || "India",
//       pincode: shippingFromBody?.pincode || user.address?.pincode,
//       geoLocation: {
//         lat: shippingFromBody?.geoLocation?.lat || user.address?.geoLocation?.lat,
//         lng: shippingFromBody?.geoLocation?.lng || user.address?.geoLocation?.lng
//       }
//     };

//     // Validate required shipping fields
//     const requiredFields = ["recipientName", "recipientPhone", "line1", "city", "state", "pincode"];
//     for (const field of requiredFields) {
//       if (!finalShippingInfo[field]) {
//         throw new Error(`Shipping field "${field}" is required`);
//       }
//     }

//     const ordersByVendor = {};

//     // Group items by vendor
//     user.cart.forEach(item => {
//       const vendorId = item.product?.createdBy?.toString();
//       if (!vendorId) throw new Error(`Product ${item.product?._id} has no vendor`);
//       if (!ordersByVendor[vendorId]) ordersByVendor[vendorId] = [];
//       ordersByVendor[vendorId].push(item);
//     });

//     const createdOrders = [];

//     for (const vendorId in ordersByVendor) {
//       const cartItems = ordersByVendor[vendorId];

//       const orderItems = cartItems.map(item => ({
//         name: item.product.title,
//         price: item.product.price,
//         quantity: item.quantity,
//         image: Array.isArray(item.product.images) ? item.product.images[0] : item.product.image,
//         product: item.product._id,
//       }));

//       // Calculate totals
//       let itemPrice = 0;
//       let tax = 0;
//       let shippingCharges = 0;

//       cartItems.forEach(item => {
//         const productPrice = item.product.price * item.quantity;
//         itemPrice += productPrice;

//         const gstRate = item.product.gstRate ? item.product.gstRate / 100 : 0;
//         tax += productPrice * gstRate;

//         if (!item.product.freeDelivery) shippingCharges += 50;
//       });

//       const totalAmount = itemPrice + tax + shippingCharges;

//       const orderData = {
//         user: userId,
//         vendor: vendorId,
//         orderItems,
//         paymentMethod,
//         shippingInfo: finalShippingInfo,
//         itemPrice,
//         tax,
//         shippingCharges,
//         totalAmount,

//       };

//       if (paymentMethod === "Online") {
//         orderData.paymentInfo = { status: "pending", id: null };
//       }

//       const [order] = await Order.create([orderData], { session });
//       createdOrders.push(order);
//     }

//     // Update user order stats
//     user.totalOrders += createdOrders.length;
//     user.totalOrderValue += createdOrders.reduce((sum, o) => sum + o.totalAmount, 0);

//     // Clear cart
//     user.cart = [];
//     await user.save({ session });

//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       orders: createdOrders,
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   } finally {
//     session.endSession();
//   }
// };

export const createOrUpdateDraftOrder = async (req, res) => {
  const userId = req.person.id;
  const { buyNow, productId, quantity = 1, color, size } = req.body;

  try {
    const user = await User.findById(userId).populate("cart.product").select("cart address name phone");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Default shipping info from user profile
    const shippingInfo = user.address ? {
      recipientName: user.address.recipientName || user.name,
      recipientPhone: user.address.recipientPhone || user.phone,
      line1: user.address.line1,
      line2: user.address.line2 || "",
      locality: user.address.locality || "",
      city: user.address.city,
      state: user.address.state,
      country: user.address.country || "India",
      pincode: user.address.pincode,
      geoLocation: user.address.geoLocation || {},
    } : {};

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
      draftOrder = await Order.findOne({ user: userId, orderStatus: "draft", "orderItems.product": productId });
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
        });
      }
    } else {
      // Cart case
      if (!user.cart.length) return res.status(400).json({ success: false, message: "Cart is empty" });
      orderItems = user.cart.map(item => ({ product: item.product._id, quantity: item.quantity, color: item.color, size: item.size }));
      itemPrice = user.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      tax = itemPrice * 0.18;
      shippingCharges = user.cart.some(i => !i.product.freeDelivery) ? 50 : 0;

      draftOrder = await Order.findOne({ user: userId, orderStatus: "draft" });
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
        });
      }
    }

    return res.status(201).json({ success: true, message: "Draft order created/updated", draftId: draftOrder._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * STEP 2: Confirm Order (Finalize with Payment + Shipping)
 */
export const confirmOrder = async (req, res) => {
  const userId = req.person.id;
  const { orderId, paymentMethod, shippingInfo } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId, orderStatus: "draft" });
    if (!order) return res.status(404).json({ success: false, message: "Draft order not found" });

    if (!paymentMethod) return res.status(400).json({ success: false, message: "Payment method required" });

    // Update shipping info
    if (shippingInfo) order.shippingInfo = shippingInfo;

    order.paymentMethod = paymentMethod;
    order.orderStatus = "Pending"; // ready for payment/delivery

    await order.save();

    return res.status(200).json({ success: true, message: "Order confirmed", orderId: order._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.person.id }).populate([
      { path: "orderItems.product", select: "title price images category brand" },
      { path: "vendor", select: "name shopName email" }
    ]);
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const isAdmin = req.person.role === "admin";
    const isVendor = req.person.role === "vendor";

    if (!isAdmin && !isVendor) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const query = buildQuery(req.query, ["status", "paymentStatus", "orderId"]);

    if (isAdmin && req.query.vendorId) {
      query.vendor = req.query.vendorId;
    } else if (isVendor) {
      query.vendor = req.person._id;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({ path: "orderItems.product", select: "title price images category brand" })
        .populate({ path: "vendor", select: "name email shopName address phone" })
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
      .populate({ path: "orderItems.product", select: "title price" })
      .populate({ path: "vendor", select: "name email address phone shopName" })
      .populate({ path: "user", select: "name email address phone" });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // 🔒 Access control: Vendor can only access their own order
    if (req.person.role === "vendor" && order.vendor.toString() !== req.person._id.toString()) {
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
