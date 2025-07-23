import express from 'express';
import fetchuser from '../middleware/fetchuser.js';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';

const router = express.Router();

// @route   GET /api/cart
router.get('/', fetchuser, getCart);

// @route   POST /api/cart
router.post('/', fetchuser, addToCart);

// @route   DELETE /api/cart
router.delete('/', fetchuser, removeFromCart);

export default router;
