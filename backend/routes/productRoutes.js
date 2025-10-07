import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRole.js";
import multerErrorHandler from "../middleware/multerErrorHandler.js";
import { getAllProducts, getProductById, getProductsByCategoryId, addProduct, getTopSellingProducts, updateProductStatus, editProduct, deleteProduct, getPendingBuyNowProducts, searchProducts } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import { body } from "express-validator";
import { validate } from "../middleware/validateFields.js";
import sanitizeHtml from "sanitize-html";

const router = express.Router();

export const editProductStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["pending", "approved", "rejected", "inactive", "pendingDeletion", "deleted", "deletionRejected"])
    .withMessage("Invalid status value"),

  body("review")
    .optional({ checkFalsy: true })
    .trim()
    .customSanitizer(value => sanitizeHtml(value, {
      allowedTags: ["p", "strong", "em", "u", "br", "ul", "ol", "li"],
      allowedAttributes: {}
    }))
    .isLength({ min: 10 }).withMessage("Review must be at least 10 characters")
];

// For product images (multiple)
const uploadProduct = upload({ folder: "products", prefix: "product", fileSize: 5 * 1024 * 1024 });

// ROUTE 1: GET /api/products
// Desc: Get all public products (home/shop pages)
router.get("/", getAllProducts);

// ROUTE 2: GET /api/products/product/:id
// Desc: Get single product by ID (public view)
router.get("/product/:id", getProductById);

// ROUTE 3: GET /api/products/top-products
// Desc: Get top-selling products (public)
router.get("/top-products", getTopSellingProducts);

// ROUTE 4: GET /api/products/category/:id
// Desc: Get products by category (public)
router.get("/category/:id", getProductsByCategoryId);

// ROUTE 5: GET /api/products/admin
// Desc: Get all products (admin dashboard)
router.get("/admin", verifyToken, authorizeRoles("admin"), getAllProducts);

// ROUTE 6: GET /api/products/admin/top-products
// Desc: Get top-selling products for admin
router.get("/admin/top-products", verifyToken, authorizeRoles("admin"), getTopSellingProducts);

// ROUTE 7: GET /api/products/admin/:id
// Desc: Get product by ID (admin detail view)
router.get("/admin/:id", verifyToken, authorizeRoles("admin"), getProductById);

// ROUTE 8: PUT /api/products/admin/edit/:id
// Desc: Edit product by ID (admin)
router.put("/admin/edit/:id", verifyToken, authorizeRoles("admin"), uploadProduct.array("images", 7), multerErrorHandler, editProduct);

// ROUTE 9: DELETE /api/products/admin/:id
// Desc: Delete product by ID (admin)
router.delete("/admin/delete/:id", verifyToken, authorizeRoles("admin"), deleteProduct);

// ROUTE 10: PUT /api/products/admin/:id/status
// Desc: Update product status by ID (admin action)
router.put("/admin/:id/status", verifyToken, authorizeRoles("admin"), editProductStatusValidator, validate, updateProductStatus);

// ROUTE 11: GET /api/products/vendor
// Desc: Get all products created by the vendor
router.get("/vendor", verifyToken, authorizeRoles("vendor"), getAllProducts);

// ROUTE 12: GET /api/products/vendor/top-products
// Desc: Get top-selling products for vendor
router.get("/vendor/top-products", verifyToken, authorizeRoles("vendor"), getTopSellingProducts);

// ROUTE 13: GET /api/products/vendor/:id
// Desc: Get product by ID (vendor detail view)
router.get("/vendor/:id", verifyToken, authorizeRoles("vendor"), getProductById);

// ROUTE 14: PUT /api/products/vendor/edit/:id
// Desc: Edit product by ID (vendor)
router.put("/vendor/edit/:id", verifyToken, authorizeRoles("vendor"), uploadProduct.array("images", 7), multerErrorHandler, editProduct);

// ROUTE 15: PUT /api/products/vendor/:id
// Desc: PUT product by ID (vendor)
router.put("/vendor/delete/:id", verifyToken, authorizeRoles("vendor"), deleteProduct);

// ROUTE 16: POST /api/products/add-product
// Desc: Add a product (vendor only)
router.post("/add-product", verifyToken, authorizeRoles("vendor"), uploadProduct.array("images", 7), multerErrorHandler, addProduct);

// get recently viewed products
router.get("/recently-viewed", verifyToken, authorizeRoles("customer"), getPendingBuyNowProducts);

// Search products (Public)
router.get("/search", searchProducts);
export default router;  