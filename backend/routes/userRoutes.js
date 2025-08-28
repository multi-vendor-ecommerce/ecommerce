import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { getAllCustomers, getUser } from "../controllers/userController.js";

const router = express.Router();

// ROUTE 1: GET /api/users/admin/all-customers
// Desc: Get all customers (admin only)
router.get("/admin/all-customers", verifyToken, authorizeRoles("admin"), getAllCustomers);

// ROUTE 2: GET /api/users/vendor/all-customers
// Desc: Get all customers who ordered from this vendor (vendor only)
router.get("/vendor/all-customers", verifyToken, authorizeRoles("vendor"), getAllCustomers);

// ROUTE 3: GET /api/profile
// Desc: Get logged-in user's details via JWT token (user only)
router.get("/profile", verifyToken, authorizeRoles("user"), getUser);

export default router;