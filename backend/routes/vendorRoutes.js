import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { getAllVendors, getTopVendors, editStore, getVendorById } from "../controllers/vendorController.js";
import { body } from "express-validator";
import uploadProfile from "../middleware/multerProfile.js";
import { validate } from "../middleware/validateFields.js";

const router = express.Router();

export const editStoreValidator = [
  body("shopName").optional().trim().escape().isLength({ min: 6 }).withMessage("Shop name must be at least 6 characters")
];

// ROUTE 1: GET /api/vendors
// Desc: Get all vendors (admin only)
router.get("/", verifyToken, authorizeRoles("admin"), getAllVendors);

// ROUTE 2: GET /api/vendors/top
// Desc: Get top vendors by revenue/sales (admin only)
router.get("/top", verifyToken, authorizeRoles("admin"), getTopVendors);

// ROUTE 3: PUT /api/vendors/edit/store
// Desc: Edit vendor store info (vendor only)
router.put("/edit/store", verifyToken, authorizeRoles("vendor"), uploadProfile.single("shopLogo"), editStoreValidator, validate, editStore);

// ROUTE 4: GET /api/vendors/:id
// Desc: Get single vendor details (admin only)
router.get("/:id", verifyToken, authorizeRoles("admin"), getVendorById);

export default router;