import express from "express";
// import Product from "../models/Products.js";

// Controllers
import { getAllProducts } from "../controllers/productController.js";

const router = express.Router();

// ROUTE 1: GET /api/products
// Desc: Showcase all the products to the user
router.get("/", getAllProducts);

// ROUTE 2: GET /api/products/admin
// Desc: Showcase all the products to the admin
router.get("/admin", getAllProducts);

export default router;