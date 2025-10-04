import express from "express";
import { trackOrder } from "../controllers/shiprocketController.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ROUTE 1: GET /api/shiprocket/track/:shipment_id
router.get("/track/:shipment_id", verifyToken, authorizeRoles("admin", "vendor", "customer"), trackOrder);

export default router;