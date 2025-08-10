import Order from "../models/Order.js";
import User from "../models/User.js";
import buildQuery from "../utils/queryBuilder.js";

export const placeOrder = async (req, res) => {
  const userId = req.person.id;

  try {
    const user = await User.findById(userId).populate("cart.product");
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const ordersByVendor = {};

    // Group cart items by vendor (createdBy)
    user.cart.forEach(item => {
      const vendorId = item.product?.createdBy?.toString();
      if (!vendorId) {
        throw new Error(`Product ${item.product?._id} has no vendor (createdBy)`);
      }
      if (!ordersByVendor[vendorId]) ordersByVendor[vendorId] = [];
      ordersByVendor[vendorId].push(item);
    });

    const createdOrders = [];

    for (const vendorId in ordersByVendor) {
      const cartItems = ordersByVendor[vendorId];

      const orderItems = cartItems.map(item => ({
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: Array.isArray(item.product.images) ? item.product.images[0] : item.product.image,
        product: item.product._id,
      }));

      // Calculate totals per vendor
      let itemPrice = 0;
      let tax = 0;
      let shippingCharges = 0;

      cartItems.forEach(item => {
        const productPrice = item.product.price * item.quantity;
        itemPrice += productPrice;

        const gstRate = item.product.gstRate ? item.product.gstRate / 100 : 0;
        tax += productPrice * gstRate;

        if (!item.product.freeDelivery) {
          shippingCharges += 50; 
        }
      });

      const totalAmount = itemPrice + tax + shippingCharges;

      const order = await Order.create({
        user: userId,
        vendor: vendorId,
        orderItems,
        paymentMethod: "COD",
        shippingInfo: {
          address: user.address || "N/A",
          city: user.city || "N/A",
          country: user.country || "India",
        },
        itemPrice,
        tax,
        shippingCharges,
        totalAmount,
      });

      createdOrders.push(order);
    }

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
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
