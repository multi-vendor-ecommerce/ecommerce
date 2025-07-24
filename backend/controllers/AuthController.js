import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Person from "../models/Person.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { toTitleCase } from "../utils/titleCase.js";

// Register a new person (User or Vendor)
export const registerPerson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  let { name, email, password, phone, address, role, shopName } = req.body;

  try {
    // Normalize input
    email = email.toLowerCase();
    name = toTitleCase(name);
    address = address ? toTitleCase(address) : "";
    shopName = shopName ? toTitleCase(shopName) : "";

    if (role === "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Admin registration is restricted" });
    }

    const existing = await Person.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    let person;

    if (role === "vendor") {
      if (!shopName) {
        return res
          .status(400)
          .json({ success: false, error: "Shop name is required for vendors" });
      }

      person = await Vendor.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        shopName,
      });
    } else {
      person = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
      });
    }

    const payload = {
      person: { id: person._id, role: person.role },
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      authToken,
      message: `${person.role} registered successfully`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Login existing person (User, Vendor, or Admin)
export const loginPerson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  let { email, password } = req.body;

  try {
    email = email.toLowerCase();

    const person = await Person.findOne({ email });
    if (!person) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const payload = {
      person: { id: person._id, role: person.role },
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, message: "Login successful", authToken });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error", message: err.message });
  }
};
