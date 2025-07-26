import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllCoupons, addCoupon, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

// ROUTE 1: GET /api/coupons
// Desc: Showcase all the coupons to the admin
router.get("/", verifyToken, getAllCoupons);

// ROUTE 2: POST /api/coupons
// Desc: Add a coupon in the admin panel
router.post("/", verifyToken, authorizeRoles("admin"), addCoupon);

// ROUTE 3: DELETE /api/coupons/:id
// Desc: Delete a coupon in the admin panel
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteCoupon);

export default router;