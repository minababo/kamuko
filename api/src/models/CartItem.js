const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

cartItemSchema.index({ cart: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("CartItem", cartItemSchema);