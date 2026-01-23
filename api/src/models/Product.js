const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, default: "", trim: true },

    price: { type: Number, required: true, min: 0 },

    imageUrl: { type: String, default: "", trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isAvailable: { type: Boolean, default: true },

    isActive: { type: Boolean, default: true },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);