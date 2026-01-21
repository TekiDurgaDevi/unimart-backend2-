const express = require("express");

const app = express();

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend working on Vercel ✅",
  });
});

module.exports = app;
