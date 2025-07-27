import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Separate controllers for admin and public
import {
  getAllProductsPublic,
  getProductByIdPublic,
  getProductsByCategoryId,
  getAllProductsAdmin,
  getProductByIdAdmin,
} from "../controllers/productController.js";

const router = express.Router();

// ---------- Public Routes ----------
router.get("/", getAllProductsPublic);                // Public: All approved products
router.get("/product/:id", getProductByIdPublic);     // Public: Product by ID
router.get("/category/:id", getProductsByCategoryId); // Public: By category

// ---------- Admin Routes ----------
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllProductsAdmin);
router.get("/admin/:id", verifyToken, authorizeRoles("admin"), getProductByIdAdmin);

export default router;
