const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

// hard-inline handlers to avoid bad imports
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, (req, res) => {
  res.json({ message: "Profile update endpoint working" });
});

module.exports = router;
