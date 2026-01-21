const express = require("express");

const app = express();

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

module.exports = app;
