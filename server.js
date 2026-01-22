const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
//app.use("/api/user", userRoutes);

// ✅ SERVE UPLOADED IMAGES
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
