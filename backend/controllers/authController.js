import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Person from "../models/Person.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { toTitleCase } from "../utils/titleCase.js";

// ==========================
// Register Person (User/Vendor)
// ==========================
export const registerPerson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  let { name, email, password, phone, address, role, shopName } = req.body;

  try {
    // Normalize & format input
    role = role?.toLowerCase();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    name = toTitleCase(name?.trim());
    address = address ? toTitleCase(address?.trim()) : "";
    shopName = shopName ? toTitleCase(shopName?.trim()) : "";

    // Restrict admin registration
    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin registration is restricted" });
    }

    // Check if email already exists
    const existing = await Person.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    // Check if shop name already exists (for vendors)
    if (role === "vendor") {
      if (!shopName) {
        return res.status(400).json({ success: false, message: "Shop name is required for vendors" });
      }

      const shopExists = await Vendor.findOne({ shopName });
      if (shopExists) {
        return res.status(400).json({ success: false, message: "Shop name already in use"});
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let person;

    if (role === "vendor") {
      person = await Vendor.create({ name, email, password: hashedPassword, phone, address, shopName });
    } else {
      person = await User.create({ name, email, password: hashedPassword, phone, address});
    }

    const payload = {
      person: {
        id: person._id,
        role: person.role,
      },
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, data: { authToken, role: person.role }, message: `${toTitleCase(person.role)} registered successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// ==========================
// Login Person (User/Vendor/Admin)
// ==========================
export const loginPerson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  let { email, password } = req.body;

  try {
    email = email?.trim().toLowerCase();
    password = password?.trim();

    const person = await Person.findOne({ email });
    if (!person) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" })}

    // Optional: restrict admin login here if needed
    // if (person.role === "admin") {
    //   return res.status(403).json({ success: false, error: "Admin login is restricted" });
    // }

    const payload = {
      person: {
        id: person._id,
        role: person.role,
      },
    };

    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, message: `${toTitleCase(person.role)} login successful`, data: { authToken, role: person.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};
