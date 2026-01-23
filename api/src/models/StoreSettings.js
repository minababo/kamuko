const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema(
  {
    orderingOpen: { type: Boolean, default: true },
    closedMessage: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);