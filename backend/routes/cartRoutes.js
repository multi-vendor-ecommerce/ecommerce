import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';

const router = express.Router();

// Get all items in user's cart
router.get('/', verifyToken, getCart);

// Add/update item in cart
router.post('/', verifyToken, addToCart);

// Remove item by productId using route param
router.delete('/:productId', verifyToken, removeFromCart);

export default router;
