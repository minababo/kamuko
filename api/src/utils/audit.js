const AuditLog = require("../models/AuditLog");

async function writeAuditLog({ actorId, action, entityType, entityId, meta }) {
  try {
    await AuditLog.create({
      actor: actorId,
      action,
      entityType,
      entityId,
      meta: meta || {},
    });
  } catch {
    // fail silently
  }
}

module.exports = { writeAuditLog };