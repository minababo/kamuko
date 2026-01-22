const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");
const { listAuditLogs } = require("../controllers/audit.controller");

const router = express.Router();

router.get(
  "/audit-logs",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  listAuditLogs
);

module.exports = router;