import express from "express";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

// Use controller functions
router.post("/", verifyToken, authorizeRoles("vendor"), createCategory);
router.get("/allCategory", getCategories);

export default router;
