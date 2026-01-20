const mongoose = require("mongoose");

const ORDER_STATUS = {
  PLACED: "placed",
  PREPARING: "preparing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true, index: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PLACED,
    },

    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },

    customerNote: { type: String, trim: true, default: "" },

    paymentMethod: {
      type: String,
      enum: ["cash"],
      default: "cash",
    },
  },
  { timestamps: true }
);

module.exports = {
  Order: mongoose.model("Order", orderSchema),
  ORDER_STATUS,
};