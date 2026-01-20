const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema(
  {
    isOrderingOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);