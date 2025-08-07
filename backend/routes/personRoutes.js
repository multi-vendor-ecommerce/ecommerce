import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getCurrentPerson } from "../controllers/personController.js";

const router = express.Router();

// ROUTE 1: GET /api/person/me
// Desc: Fetch single person details (by token)
router.get('/me', verifyToken, authorizeRoles("customer", "vendor", "admin"), getCurrentPerson);

export default router;