const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");
const {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  updateUserRole,
} = require("../controllers/users.controller");

const router = express.Router();

router.get("/users/me", authenticate, getMe);
router.patch("/users/me", authenticate, updateMe);
router.patch("/users/me/password", authenticate, changePassword);
router.get("/users", authenticate, requireRole(ROLES.ADMIN), listUsers);
router.patch("/users/:id/role", authenticate, requireRole(ROLES.ADMIN), updateUserRole);

module.exports = router;
