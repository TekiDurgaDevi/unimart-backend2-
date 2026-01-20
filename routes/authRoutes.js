const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

/* ✅ UPDATED RESET PASSWORD ROUTE (DIRECT RESET) */
router.post("/reset-password", resetPassword);

module.exports = router;
