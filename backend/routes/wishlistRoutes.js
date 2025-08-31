import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";   
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/add", verifyToken, authorizeRoles("customer"), addToWishlist);
router.post("/remove", verifyToken, authorizeRoles("customer"), removeFromWishlist);
router.get("/", verifyToken, authorizeRoles("customer"), getWishlist);

export default router;
