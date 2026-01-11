const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const meRoutes = require("./me.routes");

const router = express.Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(meRoutes);

module.exports = router;