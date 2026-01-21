const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const meRoutes = require("./me.routes");
const categoriesRoutes = require("./categories.routes");
const productsRoutes = require("./products.routes");
const cartRoutes = require("./cart.routes");
const ordersRoutes = require("./orders.routes");
const settingsRoutes = require("./settings.routes");
const auditRoutes = require("./audit.routes");
const analyticsRoutes = require("./analytics.routes");

const router = express.Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(meRoutes);
router.use(categoriesRoutes);
router.use(productsRoutes);
router.use(cartRoutes);
router.use(ordersRoutes);
router.use(settingsRoutes);
router.use(auditRoutes);
router.use(analyticsRoutes);

module.exports = router;