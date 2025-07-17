import express from "express";

// Controllers
import { getAllCoupons, addCoupon, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

// ROUTE 1: GET /api/coupons
// Desc: Showcase all the coupons to the admin
router.get("/", getAllCoupons);

// ROUTE 2: POST /api/coupons/add-coupon
// Desc: Add a coupon in the admin panel
router.post("/", addCoupon);

// ROUTE 3: DELETE /api/coupons/
// Desc: Delete a coupon in the admin panel
router.delete("/:id", deleteCoupon);

export default router;