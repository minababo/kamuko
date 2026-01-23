const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const {
  checkout,
  getMyOrders,
  getMyOrderById,
  getOrderByIdForStaff,
  listOrders,
  updateOrderStatus,
} = require("../controllers/orders.controller");

const router = express.Router();

// Customer
router.post("/orders/checkout", authenticate, requireRole(ROLES.CUSTOMER), checkout);
router.get("/orders/my", authenticate, requireRole(ROLES.CUSTOMER), getMyOrders);
router.get("/orders/my/:id", authenticate, requireRole(ROLES.CUSTOMER), getMyOrderById);

// Staff
router.get(
  "/orders",
  authenticate,
  requireRole(ROLES.CASHIER, ROLES.MANAGER, ROLES.ADMIN),
  listOrders
);

router.get(
  "/orders/:id",
  authenticate,
  requireRole(ROLES.CASHIER, ROLES.MANAGER, ROLES.ADMIN),
  getOrderByIdForStaff
);

router.patch(
  "/orders/:id/status",
  authenticate,
  requireRole(ROLES.CASHIER, ROLES.MANAGER, ROLES.ADMIN),
  updateOrderStatus
);

module.exports = router;
