import express from "express";
import { body } from "express-validator";
import { registerPerson, loginPerson } from "../controllers/authController.js";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

const registerValidator = [
  body("name", "Name must be at least 3 characters")
    .trim()
    .escape()
    .isLength({ min: 3 }),

  body("email", "Please enter a valid email")
    .trim()
    .isEmail()
    .normalizeEmail(),

  body("password", "Password must be at least 6 characters")
    .trim()
    .isLength({ min: 6 }),

  body("phone", "Phone must be valid")
    .optional()
    .trim()
    .isMobilePhone(),

  body("address", "Address must be at least 5 characters")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 5 }),

  body("shopName", "Shop name must be at least 3 characters")
    .optional()
    .trim()
    .escape()
    .isLength({ min: 3 }),

  body("role", "Invalid role")
    .optional()
    .trim()
    .isIn(["customer", "vendor"])
];

const loginValidator = [
  body("email", "Enter a valid email")
    .trim()
    .isEmail()
    .normalizeEmail(),

  body("password", "Password is required")
    .trim()
    .notEmpty()
];

router.post("/register", registerValidator, registerPerson);
router.post("/login", loginValidator, loginPerson);

router.post("/otp/request", sendOtp);
router.post("/otp/verify", verifyOtp);

export default router