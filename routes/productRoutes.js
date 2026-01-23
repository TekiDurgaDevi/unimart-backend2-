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

// ✅ PUBLIC PRODUCTS
router.get("/public", optionalAuth, getPublicProducts);

// 🔒 MY PRODUCTS
router.get("/my/products", protect, getMyProducts);

// SINGLE PRODUCT
router.get("/:id", getProductById);

// ================================
// PROTECTED ROUTES
// ================================

// ✅ ADD PRODUCT (single + multiple images supported)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },     // old frontend
    { name: "images", maxCount: 5 },    // new frontend
  ]),
  addProduct
);

// ✅ UPDATE PRODUCT (single + multiple images supported)
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);

router.delete("/:id", protect, deleteProduct);

module.exports = router;
