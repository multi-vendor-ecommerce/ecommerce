import express from "express";
// import Product from "../models/Products.js";

// Controllers
import { getAllProducts, getProduct, getProductById} from "../controllers/productController.js";

const router = express.Router();

// ROUTE 1: GET /api/products
// Desc: Showcase all the products to the user
router.get("/", getAllProducts);

// ROUTE 2: GET /api/products/admin
// Desc: Showcase all the products to the admin
router.get("/admin", getAllProducts);

// ROUTE 3: GET /api/products/admin/:id
// Desc: Showcase a product to the admin by id
router.get("/admin/:id", getProduct);

router.get("/category/:id", getProductById);

export default router;