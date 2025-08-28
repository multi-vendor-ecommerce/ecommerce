import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment, confirmCOD } from "../controllers/paymentController.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ROUTE 1: POST /api/payment/razorpay-order
// Desc: Create Razorpay order for online payment (customer only)
router.post("/razorpay-order", verifyToken, authorizeRoles("customer"), createRazorpayOrder);

// ROUTE 2: POST /api/payment/verify-payment
// Desc: Verify Razorpay payment (customer only)
router.post("/verify-payment", verifyToken, authorizeRoles("customer"), verifyRazorpayPayment);

// ROUTE 3: POST /api/payment/confirm-cod
// Desc: Confirm Cash on Delivery order (customer only)
router.post("/confirm-cod", verifyToken, authorizeRoles("customer"), confirmCOD);

export default router;