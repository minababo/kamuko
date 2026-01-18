const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },

    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    name: { type: String, required: true, trim: true },
    unitPrice: { type: Number, required: true, min: 0 },

    quantity: { type: Number, required: true, min: 1 },

    note: { type: String, trim: true, default: "" },

    lineTotal: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);