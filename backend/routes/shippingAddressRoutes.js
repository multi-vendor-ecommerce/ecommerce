// routes/shippingAddressRoutes.js
import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validateFields.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import verifyToken from "../middleware/verifyToken.js";
import { addAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/shippingAddressController.js";

const router = express.Router();

// Common reusable field rules
const recipientNameRule = body("recipientName")
  .trim()
  .isLength({ min: 3 })
  .withMessage("Recipient name must be at least 3 characters");

const recipientPhoneRule = body("recipientPhone")
  .isMobilePhone()
  .withMessage("Recipient phone must be a valid mobile number");

const line1Rule = body("line1")
  .isLength({ min: 3 })
  .withMessage("Address Line 1 must be at least 3 characters");

const cityRule = body("city").notEmpty().withMessage("City is required");
const stateRule = body("state").notEmpty().withMessage("State is required");

const pincodeRule = body("pincode")
  .matches(/^[1-9][0-9]{5}$/)
  .withMessage("Pincode must be a valid 6-digit number");

const optionalFields = [
  body("line2").optional().trim().escape(),
  body("locality").optional().trim().escape(),
  body("country").optional().trim().escape(),
  body("geoLocation.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),
  body("geoLocation.lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),
];

// Validators
export const addAddressValidator = [
  body("recipientName").notEmpty().bail().customSanitizer(v => v.trim()),
  recipientNameRule,
  body("recipientPhone").notEmpty(),
  recipientPhoneRule,
  body("line1").notEmpty(),
  line1Rule,
  cityRule,
  stateRule,
  pincodeRule,
  ...optionalFields,
];

export const updateAddressValidator = [
  recipientNameRule.optional(),
  recipientPhoneRule.optional(),
  line1Rule.optional(),
  cityRule.optional(),
  stateRule.optional(),
  pincodeRule.optional(),
  ...optionalFields,
];

// user must be logged in
router.post("/", verifyToken, authorizeRoles("customer"), addAddressValidator, validate, addAddress);
router.get("/", verifyToken, authorizeRoles("customer"), getAddresses);
router.put("/:id", verifyToken, authorizeRoles("customer"), updateAddressValidator, validate, updateAddress);
router.delete("/:id", verifyToken, authorizeRoles("customer"), deleteAddress);
router.put("/:id/default", verifyToken, authorizeRoles("customer"), setDefaultAddress);

export default router;