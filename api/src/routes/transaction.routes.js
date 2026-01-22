const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const {
  createTransaction,
  getTransactionByOrder,
  getAllTransactions,
  getTransactionStats,
} = require("../controllers/transaction.controller");

const router = express.Router();

// POST /api/transactions - Record cash payment (cashier, manager, admin only)
router.post(
  "/transactions",
  authenticate,
  requireRole(ROLES.CASHIER, ROLES.MANAGER, ROLES.ADMIN),
  createTransaction
);

// GET /api/transactions/stats - Get transaction statistics (admin only)
router.get(
  "/transactions/stats",
  authenticate,
  requireRole(ROLES.ADMIN),
  getTransactionStats
);

// GET /api/transactions/order/:orderId - Get transaction by order (staff or admin)
router.get(
  "/transactions/order/:orderId",
  authenticate,
  requireRole(ROLES.CASHIER, ROLES.MANAGER, ROLES.ADMIN),
  getTransactionByOrder
);

// GET /api/transactions - Get all transactions with pagination (admin only)
router.get(
  "/transactions",
  authenticate,
  requireRole(ROLES.ADMIN),
  getAllTransactions
);

module.exports = router;
