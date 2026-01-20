const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("connectDB() called"); // 👈 ADD THIS

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", conn.connection.name);
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
