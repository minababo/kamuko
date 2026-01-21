const AuditLog = require("../models/AuditLog");

async function listAuditLogs(req, res) {
  try {
    const filter = {};

    if (req.query.actor) filter.actor = req.query.actor;
    if (req.query.action) filter.action = req.query.action;
    if (req.query.entityType) filter.entityType = req.query.entityType;

    const logs = await AuditLog.find(filter)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json(logs);
  } catch {
    return res.status(500).json({ error: "Failed to fetch audit logs" });
  }
}

module.exports = { listAuditLogs };