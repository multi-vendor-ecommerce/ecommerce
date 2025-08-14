import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllVendors, getTopVendors, editStore, getVendorById } from "../controllers/vendorController.js";
import { body } from "express-validator";
import upload from "../middleware/multer.js";
import { validate } from "../middleware/validateFields.js";

const router = express.Router();

export const editStoreValidator = [
  body("shopName").optional().trim().escape().isLength({ min: 6 }).withMessage("Name must be at least 6 characters")
];

// ROUTE 1: GET /api/vendors
// Desc: Showcase all the vendors to the admin
router.get("/", verifyToken, authorizeRoles("admin"), getAllVendors);

// ROUTE 2: GET /api/vendors/top
// Desc: Showcase all the top vendors to the admin
router.get("/top", verifyToken, authorizeRoles("admin"), getTopVendors);

// ROUTE 3: PUT /api/vendors/top
// Desc: Showcase all the top vendors to the admin
router.put("/edit/store", verifyToken, authorizeRoles("vendor"), upload.single("shopLogo"), editStoreValidator, validate, editStore);

// ROUTE 4: GET /api/vendors/:id
// Desc: Fetch single vendor
router.get('/:id', verifyToken, authorizeRoles("admin"), getVendorById);

export default router;