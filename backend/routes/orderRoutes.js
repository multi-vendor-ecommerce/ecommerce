import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import { placeOrder, getUserOrders, getVendorOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/placeOrder", fetchuser, placeOrder);
router.get("/myOrder", fetchuser, getUserOrders);
router.get("/vendor", fetchuser, getVendorOrders);

export default router;
