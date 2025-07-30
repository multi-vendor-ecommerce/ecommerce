import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllProducts, getProductById, getProductsByCategoryId, addProduct } from "../controllers/productController.js";

const router = express.Router();

// ROUTE 1: GET /api/products
// Desc: Showcase all the products to the user
router.get("/", getAllProducts);

// ROUTE 2: GET /api/products/admin
// Desc: Showcase all the products to the admin
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllProducts);

// ROUTE 3: GET /api/products/admin/:id
// Desc: Showcase a product to the admin by id
router.get("/admin/:id", verifyToken, authorizeRoles("admin"), getProductById);

// ROUTE 4: GET /api/products/:id
// Desc: Showcase all the products to the user
router.get("/product/:id", getProductById);

// ROUTE 5: GET /api/category/:id
// Desc: Showcase all the products by category id
router.get("/category/:id", getProductsByCategoryId);

// ROUTE 6: GET /api/products/add-product
// Desc: Add a new product (admin and vendor only)
router.post("/add-product", verifyToken, authorizeRoles("admin", "vendor"), addProduct);

export default router;