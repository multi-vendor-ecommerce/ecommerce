import User from "../models/User.js";
import Order from "../models/Order.js";
import { validationResult } from 'express-validator';
import buildQuery from "../utils/queryBuilder.js";

export const getAllCustomers = async (req, res) => {
  try {
    const role = req.person?.role;
    const query = buildQuery(req.query, ["name", "email", "address"]);

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    // ⛔️ Restrict to customers who have ordered from this vendor
    if (role === "vendor") {
      const vendorId = req.person.id;

      // Step 1: Find all customer IDs with orders placed to this vendor
      const orders = await Order.find({})
        .populate({
          path: "orderItems.product",
          select: "createdBy"
        });
      
        const customerIds = [
          ...new Set(
            orders
              .filter(order =>
                order.orderItems.some(
                  item =>
                    item.product &&
                    item.product.createdBy &&
                    item.product.createdBy.toString() === vendorId.toString()
                )
              )
              .map(order => order.user.toString())
          )
        ];

      // Step 2: Add restriction to query
      query._id = { $in: customerIds };
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    res.status(200).json({ success: true, message: "Customers fetched successfully.", users, total, page, limit });
  } catch (err) {
    console.error("getAllCustomers error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error.", error: err.message });
  }
};

// Public: Get a user by id
export const getUser = async (req, res) => {
  try {
    // Fetch the user's details except password using the id
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, message: "User fetched successfully.", user });
  } catch (err) {
    // Catch the error
    console.log(err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error.", error: err.message });
  }
};