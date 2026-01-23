const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // ✅ must match User model name
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ IMPORTANT: Model name must be capitalized
module.exports = mongoose.model("Product", productSchema);
