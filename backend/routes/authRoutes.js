import express from "express";
import { body } from "express-validator";
import { registerPerson, loginPerson } from "../controllers/authController.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";
import { validate } from "../middleware/validateFields.js";

const router = express.Router();

// ==========================
// Registration Validation
// ==========================
const registerValidator = [
  body("name", "Name must be at least 3 characters")
    .trim()
    .escape()
    .isLength({ min: 3 }),

  body("email", "Please enter a valid email")
    .trim()
    .isEmail()
    .normalizeEmail(),

  body("password", "Password must be at least 8 characters")
    .trim()
    .isLength({ min: 8 }),

  body("phone", "Phone must be valid")
    .optional()
    .trim()
    .isMobilePhone(),

  body("address.line1", "Address Line 1 is required")
    .notEmpty()
    .isLength({ min: 11 }),

  body("address.city", "City is required").notEmpty(),
  body("address.state", "State is required").notEmpty(),
  body("address.pincode", "Pincode must be a valid 6-digit number")
    .matches(/^[1-9][0-9]{5}$/),

  body("shopName", "Shop name must be at least 3 characters")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 }),

  body("gstNumber", "GST number must be 15 characters")
    .optional()
    .trim()
    .isLength({ min: 15, max: 15 }),

  body("role", "Invalid role")
    .optional()
    .trim()
    .isIn(["customer", "vendor"])
];

// ==========================
// Login Validation
// ==========================
const loginValidator = [
  body("email", "Enter a valid email")
    .trim()
    .isEmail()
    .normalizeEmail(),

  body("password", "Password is required")
    .trim()
    .notEmpty()
];

// ROUTE 1: POST /api/auth/register
// Desc: Register a new person (customer or vendor)
router.post("/register", registerValidator, validate, registerPerson);

// ROUTE 2: POST /api/auth/login
// Desc: Login a person (customer, vendor, or admin)
router.post("/login", loginValidator, validate, loginPerson);

// ROUTE 3: POST /api/auth/otp/request
// Desc: Send OTP for login
router.post("/otp/request", sendOtp);

// ROUTE 4: POST /api/auth/otp/verify
// Desc: Verify OTP for login
router.post("/otp/verify", verifyOtp);

export default router;