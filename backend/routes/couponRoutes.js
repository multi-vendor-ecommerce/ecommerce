import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { getAllCoupons, addCoupon, editCoupon, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

// ROUTE 1: GET /api/coupons
// Desc: Get all coupons (public)
router.get("/", getAllCoupons);

// ROUTE 2: POST /api/coupons
// Desc: Add a coupon (admin only)
router.post("/", verifyToken, authorizeRoles("admin"), addCoupon);

// ROUTE 3: PUT /api/coupons/:id
// Desc: Edit a coupon (admin only)
router.put("/:id", verifyToken, authorizeRoles("admin"), editCoupon);

// ROUTE 4: DELETE /api/coupons/:id
// Desc: Delete a coupon (admin only)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteCoupon);

export default router;