const express = require("express");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;