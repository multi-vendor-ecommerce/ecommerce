import express from 'express';
import { body } from 'express-validator';
import verifyToken from '../middleware/verifyToken.js';
import authorizeRoles from '../middleware/authorizeRole.js';

import { getAllCustomers, getUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

// ROUTE 1: GET /api/users/admin/all-customers
// Desc: Get customers' details
router.get('/admin/all-customers', verifyToken, authorizeRoles("admin"), getAllCustomers);

// ROUTE 1: GET /api/users/vendor/all-customers
// Desc: Get customers' details
router.get('/vendor/all-customers', verifyToken, authorizeRoles("vendor"), getAllCustomers);

// ROUTE 2: GET /api/profile
// Desc: Get loggedIn user's details via the jwt token (Login required)
router.get('/profile', verifyToken, authorizeRoles("user"), getUser);

let checkers = [
  body('name', 'Enter a valid name').optional().isLength({ min: 3 }).notEmpty().trim(),
  body('address', 'Enter a valid address').optional().isLength({ min: 6 }).notEmpty().trim(),
  body('phone', 'Enter a valid phone number').optional().isMobilePhone('any').isLength({ min: 10 }).notEmpty().trim(),
]

// ROUTE 3: PUT /api/profile
// Desc: Update the existing user (Login required)
router.put('/profile', checkers, verifyToken, updateUser);

export default router;