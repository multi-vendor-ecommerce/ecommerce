import express from "express";
import { addReview, getProductReviews, markHelpful } from "../controllers/productReviewController.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("customer"), addReview);
router.get("/:productId",  getProductReviews);
router.put("/:id/helpful", verifyToken, authorizeRoles("customer"), markHelpful);

export default router;
