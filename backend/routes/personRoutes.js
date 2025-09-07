import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validateFields.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { getCurrentPerson, editPerson, deletePerson, changePassword } from "../controllers/personController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

export const editPersonValidator = [
  body("name").optional({ nullable: true }).trim().escape().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
  body("phone").optional({ nullable: true }).trim().isMobilePhone().withMessage("Phone must be valid"),
  body("address.line1").optional({ nullable: true }).isLength({ min: 3 }).withMessage("Address Line 1 must be at least 3 characters"),
  body("address.city").optional({ nullable: true }).notEmpty().withMessage("City is required"),
  body("address.state").optional({ nullable: true }).notEmpty().withMessage("State is required"),
  body("address.pincode").optional({ nullable: true }).matches(/^[1-9][0-9]{5}$/).withMessage("Pincode must be a valid 6-digit number"),
  body("address.locality").optional({ nullable: true }).trim().escape(),
  body("address.line2").optional({ nullable: true }).trim().escape(),
  body("address.recipientName").optional({ nullable: true }).trim().escape(),
  body("address.recipientPhone").optional({ nullable: true }).isMobilePhone(),
  body("address.geoLocation.lat").optional({ nullable: true }).isFloat().withMessage("Latitude must be a valid number"),
  body("address.geoLocation.lng").optional({ nullable: true }).isFloat().withMessage("Longitude must be a valid number"),
];

export const changePasswordValidator = [
  body("newPassword", "Password must be at least 8 characters").trim().isLength({ min: 8 })
];

// For profile images (single)
const uploadProfile = upload({ folder: "profiles", prefix: "profile", fixedPublicId: (req) => `profile-${req.person.id}` });

// Common auth middleware
const auth = [verifyToken, authorizeRoles("customer", "vendor", "admin")]

// ROUTE 1: GET /api/person/me
// Desc: Fetch single person details (by token)
router.get('/me', auth, getCurrentPerson);

// ROUTE 2: PUT /api/person/edit/me
// Desc: Edit single person details (by token)
router.put('/edit/me', auth, uploadProfile.single("profileImage"), editPersonValidator, validate, editPerson);

// ROUTE 3: DELETE /api/person/me
// Desc: Delete person account (by token)
router.delete('/me', auth, deletePerson);

// ROUTE 4: PUT /api/person/change-password
// Desc: Change password (by token)
router.put('/change-password', auth, changePasswordValidator, validate, changePassword);

export default router;