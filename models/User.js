const mongoose = require("mongoose");

/*
 User Schema
 -----------
 This defines how a user will be stored in MongoDB
*/
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },

    /* ==============================
       🔽 ADDED FOR FORGOT PASSWORD
       ============================== */

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    /* ==============================
       🔼 END OF ADDITION
       ============================== */
  },
  {
    timestamps: true,
  }
);

/*
 Export User model
*/
module.exports = mongoose.model("user", userSchema);
