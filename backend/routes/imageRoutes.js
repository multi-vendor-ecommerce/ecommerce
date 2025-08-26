import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import uploadProfile from "../middleware/multerProfile.js";
import uploadShopLogo from "../middleware/multerShopLogo.js";
import uploadProduct from "../middleware/multerProduct.js";
import multerErrorHandler from "../middleware/multerErrorHandler.js";

import { deleteImage, editImage } from "../controllers/imageController.js";

const router = express.Router();

// 🔐 Only logged-in users can edit/delete images
router.delete("/delete", verifyToken, authorizeRoles("vendor", "customer", "admin"), deleteImage);

router.put("/edit", verifyToken, authorizeRoles("vendor", "customer", "admin"), (req, res, next) => {
  const type = req.query.type;
  if (type === "profile") {
    uploadProfile.single("image")(req, res, next);
  } else if (type === "shopLogo") {
    uploadShopLogo.single("image")(req, res, next);
  } else {
    uploadProduct.single("image")(req, res, next);
  }
}, multerErrorHandler, editImage);

export default router;