import express from "express";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

// ROUTE 1: POST /api/category/
// Desc: Create a new category (admin only)
router.post("/", verifyToken, authorizeRoles("admin"), createCategory);

// ROUTE 2: GET /api/category/
// Desc: Get all categories (public)
router.get("/", getCategories);

export default router;