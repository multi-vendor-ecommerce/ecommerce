import express from "express";

// Controllers
import { getAllVendors } from "../controllers/vendorController.js";
import { getVendorById } from "../controllers/vendorController.js";

const router = express.Router();

// ROUTE 1: GET /api/vendors
// Desc: Showcase all the vendors to the admin
router.get("/", getAllVendors);

// ROUTE 2: GET /api/vendors/:id
// Desc: Fetch single vendor
router.get('/:id', getVendorById);

export default router;