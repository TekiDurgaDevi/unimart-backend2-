const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const {
  addProduct,
  getProductById,
  getMyProducts,
  deleteProduct,
  updateProduct,
  getPublicProducts,
} = require("../controllers/productController");

// ================================
// PUBLIC ROUTES
// ================================

// ✅ PUBLIC PRODUCTS (NO PROTECT)

router.get("/public", optionalAuth, getPublicProducts);

// 🔒 MY PRODUCTS
router.get("/my/products", protect, getMyProducts);

// SINGLE PRODUCT
router.get("/:id", getProductById);

// ================================
// PROTECTED ROUTES
// ================================
router.post("/", protect, upload.single("image"), addProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, upload.single("image"), updateProduct);

module.exports = router;
productRoutes.js