import { JWT_SECRET } from "../config/config.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

console.log("JWT: ", process.env.JWT_SECRET);

//  Register a new user
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, password, phone, address } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profileImage: "",  
      totalOrders: 0,
      totalOrderValue: 0,
      wishlist: [],
      cart: [],
      orders: [],
    });

    const payload = { user: { id: user.id, role: user.role } };
    const authToken = jwt.sign(payload, JWT_SECRET);

    res.status(201).json({ success: true, message: "User registered successfully.", authToken });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
  }
};

//  Login existing user
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, error: "Invalid credentials" });

    const payload = { user: { id: user.id, role: user.role } };
    const authToken = jwt.sign(payload, JWT_SECRET);

    res.json({ success: true, message: "Login successful.", authToken });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
  }
};

//  Get current logged-in user (no password)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};
