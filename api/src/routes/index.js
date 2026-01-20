const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const meRoutes = require("./me.routes");
const categoriesRoutes = require("./categories.routes");
const productsRoutes = require("./products.routes");
const cartRoutes = require("./cart.routes");
const ordersRoutes = require("./orders.routes");
const settingsRoutes = require("./settings.routes");

const router = express.Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(meRoutes);
router.use(categoriesRoutes);
router.use(productsRoutes);
router.use(cartRoutes);
router.use(ordersRoutes);
router.use(settingsRoutes);

module.exports = router;