import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import upload from "../middleware/multerCommon.js"; // a generic multer

import { deleteImage, editImage } from "../controllers/imageController.js";

const router = express.Router();

// 🔐 Only logged-in users can edit/delete images
router.delete("/delete", verifyToken, authorizeRoles("vendor", "customer", "admin"), deleteImage);
router.put("/edit", verifyToken, authorizeRoles("vendor", "customer", "admin"), upload.single("image"), editImage);

export default router;