const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    action: { type: String, required: true, trim: true }, 

    entityType: { type: String, required: true, trim: true }, 

    entityId: { type: mongoose.Schema.Types.ObjectId, required: false },

    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);