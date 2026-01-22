const express = require("express");
const authenticate = require("../middleware/auth");
const { getMe, updateMe, changePassword } = require("../controllers/users.controller");

const router = express.Router();

router.get("/users/me", authenticate, getMe);
router.patch("/users/me", authenticate, updateMe);
router.patch("/users/me/password", authenticate, changePassword);

module.exports = router;