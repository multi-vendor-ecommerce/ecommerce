import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Person from "../models/Person.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { toTitleCase } from "../utils/titleCase.js";
import { addVendorPickup } from "../services/shiprocket/pickup.js";

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

    // Regex Validations
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number." });
    }
    if (!pincodeRegex.test(pincode?.toString().trim())) {
      return res.status(400).json({ success: false, message: "Invalid pincode." });
    }
    if (role === "vendor" && gstNumber && !gstRegex.test(gstNumber)) {
      return res.status(400).json({ success: false, message: "Invalid GST number." });
    }

    // Password Validation
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password too short." });
    }
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must include letters, numbers, and a special character.",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }
    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin registration not allowed." });
    }

    // Check for existing email
    let existing = await Person.findOne({ email });

    if (existing) {
      if (role === "vendor") {
        if (["pending", "approved"].includes(existing.status)) {
          return res.status(400).json({ success: false, message: "Email already in use." });
        }
      } else {
        return res.status(400).json({ success: false, message: "Email already in use." });
      }
    }

    // Vendor-specific checks
    if (role === "vendor") {
      if (!shopName) {
        return res.status(400).json({ success: false, message: "Shop name required." });
      }
      const shopExists = await Vendor.findOne({ shopName });
      if (shopExists) {
        return res.status(400).json({ success: false, message: "Shop name already in use." });
      }
      if (gstNumber) {
        const gstExists = await Vendor.findOne({ gstNumber });
        if (gstExists) {
          return res.status(400).json({ success: false, message: "GST number already registered." });
        }
      }
    }

    // Format address
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

    // Hash password and create user/vendor
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

      // -------------------------
      // SHIPROCKET PICKUP INTEGRATION
      // -------------------------
      try {
        await addVendorPickup(person); // <-- auto-add pickup location
      } catch (err) {
        console.error("Shiprocket Pickup Error:", err.message);
        // Continue without blocking registration
      }

    } else {
      person = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address: formattedAddress,
      });
    }

    // JWT payload and token
    const payload = {
      person: {
        id: person._id,
        role: person.role,
      },
    };
    const expiresIn = person.role === "customer" ? "7d" : "6h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    return res.status(201).json({
      success: true,
      message: `${toTitleCase(person.role)} registered.`,
      data: { authToken, role: person.role },
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    return res.status(500).json({ success: false, message: "Registration failed.", error: err.message });
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

    // Find user by email
    const person = await Person.findOne({ email });
    if (!person) {
      return res.status(400).json({ success: false, message: "Invalid email or password. Try again." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, person.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password. Try again." });
    }

    // JWT payload and token
    const payload = {
      person: {
        id: person._id,
        role: person.role,
      },
    };
    const expiresIn = person.role === "customer" ? "7d" : "6h";
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    return res.status(200).json({
      success: true,
      message: person.status === "inactive" ? "Your account is inactive. Request for activation."
      : person.status === "pending" ? "Your account is pending approval. Please wait."
      : person.status === "rejected" || person.status === "suspended" ? `Your account registration was ${person.status}. Contact support.`
      : `${toTitleCase(person.role)} login successful.`,
      data: { authToken, role: person.role, status: person.status },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ success: false, message: "Login failed.", error: err.message });
  }
};