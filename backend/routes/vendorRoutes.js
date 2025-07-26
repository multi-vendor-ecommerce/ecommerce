import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllVendors } from "../controllers/vendorController.js";
import { getVendorById } from "../controllers/vendorController.js";

const router = express.Router();

// ROUTE 1: GET /api/vendors
// Desc: Showcase all the vendors to the admin
router.get("/", verifyToken, authorizeRoles("admin"), getAllVendors);

// ROUTE 2: GET /api/vendors/:id
// Desc: Fetch single vendor
router.get('/:id', verifyToken, authorizeRoles("admin"), getVendorById);

export default router;