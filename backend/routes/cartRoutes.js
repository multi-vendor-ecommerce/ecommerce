import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

// ROUTE 1: GET /api/cart/
// Desc: Get all items in user's cart
router.get("/", verifyToken, authorizeRoles("customer"), getCart);

// ROUTE 2: POST /api/cart/
// Desc: Add or update item in cart
router.post("/", verifyToken, authorizeRoles("customer"), addToCart);

// ROUTE 3: DELETE /api/cart/:cartItemId
// Desc: Remove item from cart by cartItemId
router.delete("/:cartItemId", verifyToken, authorizeRoles("customer"), removeFromCart);

export default router;