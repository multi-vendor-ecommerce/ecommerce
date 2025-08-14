import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllVendors, getTopVendors ,getVendorById } from "../controllers/vendorController.js";

const router = express.Router();

// ROUTE 1: GET /api/vendors
// Desc: Showcase all the vendors to the admin
router.get("/", verifyToken, authorizeRoles("admin"), getAllVendors);

// ROUTE 2: GET /api/vendors/top
// Desc: Showcase all the top vendors to the admin
router.get("/top", verifyToken, authorizeRoles("admin"), getTopVendors);

// ROUTE 3: GET /api/vendors/:id
// Desc: Fetch single vendor
router.get('/:id', verifyToken, authorizeRoles("admin"), getVendorById);

export default router;