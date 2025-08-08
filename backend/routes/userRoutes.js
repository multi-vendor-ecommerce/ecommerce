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

export default router;