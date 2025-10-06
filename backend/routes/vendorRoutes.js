import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import { getAllVendors, getTopVendors, editStore, getVendorById, updateVendorStatus, adminEditVendor, reactivateVendorAccount, vendorPlaceOrder, cancelVendorOrder, returnOrderRequest } from "../controllers/vendorController.js";
import { body } from "express-validator";
import { validate } from "../middleware/validateFields.js";
import upload from "../middleware/multer.js";
import sanitizeHtml from "sanitize-html";

const router = express.Router();

export const editStoreValidator = [
  body("shopName").optional().trim().escape().isLength({ min: 6 }).withMessage("Shop name must be at least 6 characters")
];

export const editVendorValidator = [
  body("commissionRate").optional({ nullable: true }).isFloat({ min: 0, max: 100 }).withMessage("Commission Rate must be a number between 0 and 100"),
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

export const editVendorStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["pending", "active", "inactive", "suspended", "rejected"])
    .withMessage("Invalid status value"),

  body("review")
    .optional({ checkFalsy: true })
    .trim()
    .customSanitizer((value) =>
      sanitizeHtml(value, {
        allowedTags: ["p", "strong", "em", "u", "br", "ul", "ol", "li"],
        allowedAttributes: {}
      })
    )
    .isLength({ min: 10 }).withMessage("Review must be at least 10 characters")
];

// For shop logo images (single)
const uploadShopLogo = upload({ folder: "shopLogos", prefix: "shopLogo", fixedPublicId: (req) => `shopLogo-${req.person.id}` });

// ROUTE 1: GET /api/vendors
// Desc: Get all vendors (admin only)
router.get("/", verifyToken, authorizeRoles("admin"), getAllVendors);

// ROUTE 2: GET /api/vendors/top
// Desc: Get top vendors by revenue/sales (admin only)
router.get("/top", verifyToken, authorizeRoles("admin"), getTopVendors);

// ROUTE 3: PUT /api/vendors/:id/status
// Desc: Update vendor status (admin only)
router.put("/:id/status", verifyToken, authorizeRoles("admin"), editVendorStatusValidator, validate, updateVendorStatus);

// ROUTE 4: PUT /api/vendors/edit/store
// Desc: Edit vendor store info (vendor only)
router.put("/edit/store", verifyToken, authorizeRoles("vendor"), uploadShopLogo.single("shopLogo"), editStoreValidator, validate, editStore);

// ROUTE 5: PUT /api/vendors/reactivate
// Desc: Reactivate vendor account (vendor only)
router.put("/reactivate", verifyToken, authorizeRoles("vendor"), reactivateVendorAccount);

// ROUTE 6: GET /api/vendors/:id
// Desc: Get single vendor details (admin only)
router.get("/:id", verifyToken, authorizeRoles("admin"), getVendorById);

// ROUTE 7: PUT /api/vendors/:id
// Desc: Admin edit vendor details (admin only)
router.put("/:id", verifyToken, authorizeRoles("admin"), editVendorValidator, validate, adminEditVendor);

// shiprocket api : --------------

// Vendor can only place their own items
router.put("/create-order/:id", verifyToken, authorizeRoles("vendor"), vendorPlaceOrder);

router.get("/cancel-order/:id", verifyToken, authorizeRoles("vendor", "admin"), cancelVendorOrder);

// Return order - accessible by vendor and admin
router.get("/return-order/:id", verifyToken, authorizeRoles("vendor", "admin"), returnOrderRequest);

export default router;