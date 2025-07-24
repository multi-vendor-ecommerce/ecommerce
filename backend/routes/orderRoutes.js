import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { placeOrder, getUserOrders, getVendorOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/placeOrder", verifyToken, placeOrder);
router.get("/myOrder", verifyToken, getUserOrders);
router.get("/vendor", verifyToken, getVendorOrders);

export default router;
