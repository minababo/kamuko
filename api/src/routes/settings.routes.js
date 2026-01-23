const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const {
  getStoreSettings,
  updateStoreSettings,
} = require("../controllers/settings.controller");

const router = express.Router();

// Public read
router.get("/settings/store", getStoreSettings);

// Manager/Admin
router.put(
  "/settings/store",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  updateStoreSettings
);

module.exports = router;