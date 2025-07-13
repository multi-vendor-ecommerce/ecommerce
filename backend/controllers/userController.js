import User from "../models/User.js";
import { validationResult } from 'express-validator';

// Public: Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    // Fetch the customers' details except password using the id
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    // Catch the error
    console.log(err.message);
    return res.status(500).json({ success: false, error: 'Interal Server Error', message: err.message });
  }
}

// Public: Get a user by id
export const getUser = async (req, res) => {
  try {
    // Fetch the user's details except password using the id
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    // Catch the error
    console.log(err.message);
    return res.status(500).json({ success: false, error: 'Interal Server Error', message: err.message });
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
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    // Catch the error
    console.log(err.message);
    return res.status(500).json({ success: false, error: 'Interal Server Error', message: err.message });
  }
}