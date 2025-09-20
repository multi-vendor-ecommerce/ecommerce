import express from "express";
import { getAllInvoices } from "../controllers/invoiceController.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Vendor → only their invoices
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getAllInvoices);

// Admin → all invoices
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllInvoices);

export default router;