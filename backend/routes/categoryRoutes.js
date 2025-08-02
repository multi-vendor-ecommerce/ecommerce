import express from "express";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";
import { createCategory, getCategoriesByLevel } from "../controllers/categoryController.js";

const router = express.Router();

// Use controller functions
router.post("/", verifyToken, authorizeRoles("admin"), createCategory);
// router.get("/allCategory", getCategories);
router.get("/", getCategoriesByLevel);

export default router;
