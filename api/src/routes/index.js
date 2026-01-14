const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const meRoutes = require("./me.routes");
const categoriesRoutes = require("./categories.routes");
const productsRoutes = require("./products.routes");

const router = express.Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(meRoutes);
router.use(categoriesRoutes);
router.use(productsRoutes);

module.exports = router;