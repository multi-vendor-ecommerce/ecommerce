import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { createOrUpdateDraftOrder, getAllOrders, getOrderById, getUserDraftOrder } from "../controllers/orderController.js";

const router = express.Router();

/**
 * @route   GET /api/orders/vendor
 * @desc    Get all orders related to the logged-in vendor
 * @access  Private (Vendor)
 */
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getAllOrders);

/**
 * @route   GET /api/orders/vendor/:id
 * @desc    Get specific order details by order ID
 * @access  Private (Vendor)
 */
router.get("/vendor/:id", verifyToken, authorizeRoles("vendor"), getOrderById);

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

router.post("/create-draft", verifyToken, authorizeRoles("customer"), createOrUpdateDraftOrder);

// Place generic routes LAST
router.get("/draft/:id", verifyToken, authorizeRoles("customer"), getUserDraftOrder);
router.get("/:id", verifyToken, authorizeRoles("customer"), getOrderById);

export default router;
