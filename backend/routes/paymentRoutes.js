import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  confirmCOD
} from "../controllers/paymentController.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/razorpay-order", verifyToken, authorizeRoles("customer"), createRazorpayOrder);
router.post("/verify-payment",  verifyToken, authorizeRoles("customer"), verifyRazorpayPayment);
router.post("/confirm-cod",  verifyToken, authorizeRoles("customer"), confirmCOD);

export default router;
