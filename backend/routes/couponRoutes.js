import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllCoupons, addCoupon, editCoupon, deleteCoupon } from "../controllers/couponController.js";

const router = express.Router();

// ROUTE 1: GET /api/coupons
// Desc: Showcase all the coupons to the admin/user
router.get("/", getAllCoupons);

// ROUTE 2: POST /api/coupons
// Desc: Add a coupon in the admin panel
router.post("/", verifyToken, authorizeRoles("admin"), addCoupon);

// ROUTE 3: PUT /api/coupons
// Desc: Edit a coupon in the admin panel
router.put("/", verifyToken, authorizeRoles("admin"), editCoupon);

// ROUTE 4: DELETE /api/coupons/:id
// Desc: Delete a coupon in the admin panel
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteCoupon);

export default router;