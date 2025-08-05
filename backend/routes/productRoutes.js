import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import upload from "../middleware/multer.js";

// Controllers
import {
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  addProduct,
  getTopSellingProducts,
} from "../controllers/productController.js";

const router = express.Router();

/* 
 📦 PUBLIC ROUTES (No auth required)
*/

// ROUTE 1: GET /api/products
// Desc: Get all public products (home/shop pages)
router.get("/", getAllProducts);

// ROUTE 2: GET /api/products/product/:id
// Desc: Get single product by ID (public view)
router.get("/product/:id", getProductById);

// ROUTE 3: GET /api/products/top-products
// Desc: Get top-selling products (public)
router.get("/top-products", getTopSellingProducts);

// ROUTE 4: GET /api/products/category/:id
// Desc: Get products by category (public)
router.get("/category/:id", getProductsByCategoryId);


/* 
 🔐 ADMIN ROUTES (Auth + Role = admin)
*/

// ROUTE 5: GET /api/products/admin
// Desc: Get all products (admin dashboard)
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllProducts);

// ROUTE 6: GET /api/products/admin/top-products
// Desc: Get top-selling products for admin
router.get("/admin/top-products", verifyToken, authorizeRoles("admin"), getTopSellingProducts);

// ROUTE 7: GET /api/products/admin/:id
// Desc: Get product by ID (admin detail view)
router.get("/admin/:id", verifyToken, authorizeRoles("admin"), getProductById);


/* 
  🛒 VENDOR ROUTES (Auth + Role = vendor) 
*/

// ROUTE 8: GET /api/products/vendor
// Desc: Get all products created by the vendor
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getAllProducts);

// ROUTE 9: GET /api/products/vendor/top-products
// Desc: Get top-selling products for vendor
router.get("/vendor/top-products", verifyToken, authorizeRoles("vendor"), getTopSellingProducts);

// ROUTE 10: GET /api/products/vendor/:id
// Desc: Get product by ID (vendor detail view)
router.get("/vendor/:id", verifyToken, authorizeRoles("vendor"), getProductById);

// ROUTE 10: POST /api/products/add-product
// Desc: Add a product (admin + vendor only)
router.post("/add-product", verifyToken, authorizeRoles("admin", "vendor"), upload.array("images", 7), addProduct);

export default router;