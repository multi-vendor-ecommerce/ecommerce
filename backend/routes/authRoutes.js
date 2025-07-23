import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser } from "../controllers/AuthController.js";

const router = express.Router();

const registerValidator = [
  body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  body("phone", "Phone must be valid").optional().isMobilePhone(),
  body("address", "Address must be at least 5 characters").optional().isLength({ min: 5 }),
];

const loginValidator = [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password is required").exists(),
];

router.post("/createuser", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);

export default router;
