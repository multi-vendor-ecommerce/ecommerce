import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Person from "../models/Person.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { toTitleCase } from "../utils/titleCase.js";

// ==========================
// Register Person (User/Vendor)
// ==========================
export const registerPerson = async (req, res) => {
  let { name, email, password, confirmPassword, phone, role, shopName, gstNumber, address = {} } = req.body;

  try {
    // Normalize input
    role = role?.toLowerCase();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    confirmPassword = confirmPassword?.trim();
    name = toTitleCase(name?.trim());
    shopName = shopName ? toTitleCase(shopName?.trim()) : "";
    gstNumber = gstNumber?.trim().toUpperCase();

    // Address destructuring
    const {
      name: recipientName = "",
      phone: deliveryPhone = "",
      line1 = "",
      line2 = "",
      locality = "",
      city = "",
      state = "",
      country = "India",
      pincode = "",
      geoLocation = {},
    } = address;

    // ==========================
    // Regex Validations
    // ==========================
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number format." });
    }

    const trimmedPincode = pincode?.toString().trim();
    if (!pincodeRegex.test(trimmedPincode)) {
      return res.status(400).json({ success: false, message: "Invalid pincode format." });
    }

    if (role === "vendor" && gstNumber && !gstRegex.test(gstNumber)) {
      return res.status(400).json({ success: false, message: "Invalid GST number format." });
    }

    // ==========================
    // Password Validation
    // ==========================
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must include letters, numbers, and at least one special character.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin registration is restricted" });
    }

    const existing = await Person.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    if (role === "vendor") {
      if (!shopName) {
        return res.status(400).json({ success: false, message: "Shop name is required for vendors" });
      }

      const shopExists = await Vendor.findOne({ shopName });
      if (shopExists) {
        return res.status(400).json({ success: false, message: "Shop name already in use" });
      }
    }

    const formattedAddress = {
      name: toTitleCase(recipientName.trim()),
      phone: deliveryPhone.trim(),
      line1: toTitleCase(line1.trim()),
      line2: toTitleCase(line2.trim()),
      locality: toTitleCase(locality.trim()),
      city: toTitleCase(city.trim()),
      state: toTitleCase(state.trim()),
      country: toTitleCase(country.trim()),
      pincode: pincode.trim(),
      geoLocation: {
        lat: typeof geoLocation.lat === "number" ? geoLocation.lat : null,
        lng: typeof geoLocation.lng === "number" ? geoLocation.lng : null,
      },
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    let person;

    if (role === "vendor") {
      person = await Vendor.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address: formattedAddress,
        shopName,
        gstNumber,
      });
    } else {
      person = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address: formattedAddress,
      });
    }

    const payload = {
      person: {
        id: person._id,
        role: person.role,
      },
    };

    const expiresIn = person.role === "customer" ? "7d" : "6h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    res.status(201).json({
      success: true,
      data: { authToken, role: person.role },
      message: `${toTitleCase(person.role)} registered successfully`,
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// ==========================
// Login Person (User/Vendor/Admin)
// ==========================
export const loginPerson = async (req, res) => {

  let { email, password } = req.body;

  try {
    email = email?.trim().toLowerCase();
    password = password?.trim();

    const person = await Person.findOne({ email });
    const isMatch = await bcrypt.compare(password, person.password);
    if (!person || !isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect email or password. Please try again." });
    }

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

    const expiresIn = person.role === "customer" ? "7d" : "6h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    res.json({ success: true, message: `${toTitleCase(person.role)} login successful`, data: { authToken, role: person.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};
