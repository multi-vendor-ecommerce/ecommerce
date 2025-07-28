import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { placeOrder, getUserOrders, getVendorOrders, getAllOrders, getOrderById } from "../controllers/orderController.js";

const router = express.Router();

/**
 * @route   POST /api/orders/placeOrder
 * @desc    Place a new order by a logged-in user
 * @access  Private (User)
 */
router.post("/placeOrder", verifyToken, placeOrder);

/**
 * @route   GET /api/orders/myOrder
 * @desc    Get all orders placed by the logged-in user
 * @access  Private (User)
 */
router.get("/myOrder", verifyToken, getUserOrders);

/**
 * @route   GET /api/orders/vendor
 * @desc    Get all orders related to the logged-in vendor
 * @access  Private (Vendor)
 */
router.get("/vendor", verifyToken, getVendorOrders);

/**
 * @route   GET /api/orders/admin
 * @desc    Get all orders across the platform (Admin dashboard)
 * @access  Private (Admin)
 */
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllOrders);

/**
 * @route   GET /api/orders/admin/:id
 * @desc    Get specific order details by order ID (Admin only)
 * @access  Private (Admin)
 */
router.get("/admin/:id", verifyToken, authorizeRoles("admin"), getOrderById);

export default router;
