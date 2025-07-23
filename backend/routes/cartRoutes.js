import express from 'express';
import fetchuser from '../middleware/fetchuser.js';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';

const router = express.Router();

// Get all items in user's cart
router.get('/', fetchuser, getCart);

// Add/update item in cart
router.post('/', fetchuser, addToCart);

// Remove item by productId using route param
router.delete('/:productId', fetchuser, removeFromCart);

export default router;
