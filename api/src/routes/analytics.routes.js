const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const { getOverview } = require("../controllers/analytics.controller");

const router = express.Router();

router.get(
  "/analytics/overview",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  getOverview
);

module.exports = router;