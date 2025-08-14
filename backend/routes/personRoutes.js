import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validateFields.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";

// Controllers
import { getCurrentPerson, editPerson, deletePerson, changePassword } from "../controllers/personController.js";

const router = express.Router();

export const editPersonValidator = [
  body("name").optional().trim().escape().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("phone").optional().trim().isMobilePhone().withMessage("Phone must be valid"),

  body("address.line1").optional().isLength({ min: 3 }).withMessage("Address Line 1 must be at least 3 characters"),

  body("address.city").optional().notEmpty().withMessage("City is required"),
  body("address.state").optional().notEmpty().withMessage("State is required"),

  body("address.pincode")
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Pincode must be a valid 6-digit number"),

  body("address.locality").optional().trim().escape(),
  body("address.line2").optional().trim().escape(),
  body("address.recipientName").optional().trim().escape(),
  body("address.recipientPhone").optional().isMobilePhone(),

  body("address.geoLocation.lat").optional().isFloat().withMessage("Latitude must be a valid number"),
  body("address.geoLocation.lng").optional().isFloat().withMessage("Longitude must be a valid number"),
];

export const changePasswordValidator = [
  body("newPassword", "Password must be at least 8 characters").trim().isLength({ min: 8 })
];

// Common auth middleware
const auth = [verifyToken, authorizeRoles("customer", "vendor", "admin")];

// ROUTE 1: GET /api/person/me
// Desc: Fetch single person details (by token)
router.get('/me', auth, getCurrentPerson);

// ROUTE 2: PUT /api/person/edit/me
// Desc: Edit single person details (by token)
router.put('/edit/me', auth, upload.single("profileImage"), editPersonValidator, validate, editPerson);

// ROUTE 3: DELETE /api/person/me
// Desc: Delete person account (by token)
router.delete('/me', auth, deletePerson);

// ROUTE 4: PUT /api/person/change-password
// Desc: Change password (by token)
router.put('/change-password', auth, changePasswordValidator, validate, changePassword);

export default router;