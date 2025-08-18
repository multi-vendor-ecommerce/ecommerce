import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { createOrUpdateDraftOrder, confirmOrder, getAllOrders, getOrderById, getUserDraftOrder } from "../controllers/orderController.js";

const router = express.Router();

/**
 * @route   POST /api/orders/placeOrder
 * @desc    Place a new order by a logged-in user
 * @access  Private (User)
 */
router.post("/create-draft", verifyToken, createOrUpdateDraftOrder);

router.get("/draft/:id", verifyToken, getUserDraftOrder);

/**
 * @route   GET /api/orders/myOrder
 * @desc    Get all orders placed by the logged-in user
 * @access  Private (User)
 */
router.post("/confirm", verifyToken, confirmOrder);

/**
 * @route   GET /api/orders/vendor
 * @desc    Get all orders related to the logged-in vendor
 * @access  Private (Vendor)
 */
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getAllOrders);

/**
 * @route   GET /api/orders/vendor/:id
 * @desc    Get specific order details by order ID (Admin only)
 * @access  Private (Vendor)
 */
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getOrderById);

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
