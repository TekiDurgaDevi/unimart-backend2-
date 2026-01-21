const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const productRoutes = require("../routes/productRoutes");
const userRoutes = require("../routes/userRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ❌ DO NOT use app.listen()
// ❌ DO NOT define PORT

module.exports = app;