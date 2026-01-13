const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const meRoutes = require("./me.routes");
const categoriesRoutes = require("./categories.routes");

const router = express.Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(meRoutes);
router.use(categoriesRoutes);

module.exports = router;