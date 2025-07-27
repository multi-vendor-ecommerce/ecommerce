import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getAllProducts, getProductById, getProductsByCategoryId} from "../controllers/productController.js";

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

router.get("/product/:id", getProductById);

router.get("/category/:id", getProductsByCategoryId);


export default router;