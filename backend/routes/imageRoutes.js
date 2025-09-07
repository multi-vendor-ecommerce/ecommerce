import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import multerErrorHandler from "../middleware/multerErrorHandler.js";
import { deleteImage, editImage } from "../controllers/imageController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

const uploadProfile = upload({ folder: "profiles", prefix: "profile" });
const uploadShopLogo = upload({ folder: "shopLogos", prefix: "shopLogo" });
const uploadCategoryImage = upload({ folder: "categories", prefix: "category" });

// ROUTE 1: DELETE /api/image/delete
// Desc: Delete an image (vendor, customer, admin)
router.delete("/delete", verifyToken, authorizeRoles("vendor", "customer", "admin"), deleteImage);

// ROUTE 2: PUT /api/image/edit
// Desc: Edit/replace an image (vendor, customer, admin)
router.put(
  "/edit",
  verifyToken,
  authorizeRoles("vendor", "customer", "admin"),
  (req, res, next) => {
    const type = req.query.type;

    switch (type) {
      case "profile":
        return uploadProfile.single("profileImage")(req, res, next);
      case "shopLogo":
        return uploadShopLogo.single("shopLogo")(req, res, next);
      case "category":
        return uploadCategoryImage.single("categoryImage")(req, res, next);
      case "product":
        return uploadProduct.single("image")(req, res, next);
      default:
        return res.status(400).json({ success: false, message: "Invalid image type." });
    }
  },
  multerErrorHandler,
  editImage
);

export default router;