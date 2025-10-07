import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { createOrUpdateDraftOrder, getAllOrders, getOrderById, getUserDraftOrder, placeOrder, cancelOrder, returnOrderRequest } from "../controllers/orderController.js";

const router = express.Router();

// ROUTE 1: GET /api/orders/vendor
// Desc: Get all orders for the logged-in vendor
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getAllOrders);

// ROUTE 2: GET /api/orders/vendor/:id
// Desc: Get specific order details by order ID (vendor)
router.get("/vendor/:id", verifyToken, authorizeRoles("vendor"), getOrderById);

// ROUTE 3: GET /api/orders/admin
// Desc: Get all orders for admin dashboard
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllOrders);

// ROUTE 4: GET /api/orders/admin/:id
// Desc: Get specific order details by order ID (admin)
router.get("/admin/:id", verifyToken, authorizeRoles("admin"), getOrderById);

// ROUTE 5: GET /api/orders
// Desc: Get all orders for the logged-in customer
router.get("/", verifyToken, authorizeRoles("customer"), getAllOrders);

// ROUTE 6: POST /api/orders/create-draft
// Desc: Create or update draft order (customer only)
router.post("/create-draft", verifyToken, authorizeRoles("customer"), createOrUpdateDraftOrder);

// ROUTE 7: GET /api/orders/draft/:id
// Desc: Get a draft order for the logged-in customer
router.get("/draft/:id", verifyToken, authorizeRoles("customer"), getUserDraftOrder);

// ROUTE 8: GET /api/orders/:id
// Desc: Get specific order details by order ID (customer)
router.get("/:id", verifyToken, authorizeRoles("customer"), getOrderById);

// Shiprocket apis
// ROUTE 9: GET /api/orders/create-order/:id
// Desc: Place order on Shiprocket (vendor only)
router.put("/create-order/:id", verifyToken, authorizeRoles("vendor"), placeOrder);

// ROUTE 10: GET /api/orders/cancel-order/:id
// Desc: Cancel order - accessible by vendor and admin
router.patch("/cancel-order/:id", verifyToken, authorizeRoles("vendor", "admin", "customer"), cancelOrder);

// ROUTE 11: GET /api/orders/return-order/:id
// Desc: Return order - accessible by vendor and admin
router.get("/return-order/:id", verifyToken, authorizeRoles("vendor", "admin"), returnOrderRequest);

export default router;