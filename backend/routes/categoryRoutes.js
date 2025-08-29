import express from "express";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import upload from "../middleware/multer.js";

// For category images (single)
const uploadCategoryImage = upload({ folder: "categories", prefix: "category" });

const router = express.Router();

// ROUTE 1: POST /api/categories/
// Desc: Create a new category (admin only)
router.post("/", verifyToken, authorizeRoles("admin"), uploadCategoryImage.single("categoryImage"), createCategory);

// ROUTE 2: GET /api/categories/
// Desc: Get all categories (public)
router.get("/", getCategories);

export default router;