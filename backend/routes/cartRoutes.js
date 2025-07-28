import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import authorizeRoles from '../middleware/authorizeRole.js';

const router = express.Router();

// Get all items in user's cart
router.get('/', verifyToken, authorizeRoles("user"), getCart);

// Add/update item in cart
router.post('/', verifyToken, authorizeRoles("user"), addToCart);

// Remove item by productId using route param
router.delete('/:productId', verifyToken, authorizeRoles("user"), removeFromCart);

export default router;
