import User from "../models/User.js";
import { validationResult } from 'express-validator';
import buildQuery from "../utils/queryBuilder.js";

export const getAllCustomers = async (req, res) => {
  try {
    const query = buildQuery(req.query, ["name", "email", "address"]);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }), // optional sort
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Customers fetched successfully.",
      users,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("getAllCustomers error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: err.message,
    });
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
}

// Private: Update user
export const updateUser = async (req, res) => {
  // Check if there are any errors or not
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a bad request
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, address, phone } = req.body;

  const updateFields = {};
  if (name) {
    updateFields.name = name.replace(/\b\w/g, char => char.toUpperCase());
  }
  if (address) updateFields.address = address;
  if (phone) updateFields.phone = phone;

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updateFields }, { new: true });
    res.status(200).json({ success: true, message: "User updated successfully.", user: updatedUser });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error.", error: err.message });
  }
}