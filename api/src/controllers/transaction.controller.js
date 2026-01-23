const Transaction = require("../models/Transaction");
const { Order } = require("../models/Order");
const { writeAuditLog } = require("../utils/audit");

/**
 * POST /api/transactions
 * Record cash payment when customer picks up order (staff/cashier only)
 */
async function createTransaction(req, res) {
  try {
    const { orderId, amount } = req.body;

    // Validate required fields
    if (!orderId || !amount) {
      return res.status(400).json({ error: "orderId and amount are required" });
    }

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if transaction already exists for this order
    const existingTransaction = await Transaction.findOne({ orderId });
    if (existingTransaction) {
      return res.status(400).json({ error: "Transaction already exists for this order" });
    }

    // Validate amount matches order total
    if (amount !== order.total) {
      return res.status(400).json({
        error: "Transaction amount must match order total",
        expected: order.total,
        provided: amount,
      });
    }

    // Create transaction with cash payment method
    const transaction = await Transaction.create({
      orderId,
      amount,
      paymentMethod: "Cash",
      status: "Paid",
      transactionDate: new Date(),
    });

    await writeAuditLog(
      req.user._id,
      "CREATE",
      "Transaction",
      transaction._id,
      null,
      transaction.toObject(),
      `Cash payment recorded for order ${order.orderNumber}`
    );

    res.status(201).json({
      message: "Transaction recorded successfully",
      transaction: await Transaction.findById(transaction._id).populate("orderId"),
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
}

/**
 * GET /api/transactions/order/:orderId
 * Get transaction by order ID (staff or admin)
 */
async function getTransactionByOrder(req, res) {
  try {
    const { orderId } = req.params;

    const transaction = await Transaction.findOne({ orderId }).populate({
      path: "orderId",
      populate: { path: "user", select: "name email" },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found for this order" });
    }

    res.json({ transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
}

/**
 * GET /api/transactions
 * Get all transactions with pagination and optional date range filtering (admin only)
 */
async function getAllTransactions(req, res) {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: "Page and limit must be positive integers" });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      // Set to end of day
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      dateFilter.$lte = endDateObj;
    }

    const filter = {};
    if (Object.keys(dateFilter).length > 0) {
      filter.transactionDate = dateFilter;
    }

    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate({
          path: "orderId",
          populate: { path: "user", select: "name email" },
        })
        .sort({ transactionDate: -1 })
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}

/**
 * GET /api/transactions/stats
 * Get transaction statistics (admin only)
 */
async function getTransactionStats(req, res) {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      dateFilter.$lte = endDateObj;
    }

    const match = { status: "Paid" };
    if (Object.keys(dateFilter).length > 0) {
      match.transactionDate = dateFilter;
    }

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalCashCollected: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
          averageOrderValue: { $avg: "$amount" },
        },
      },
    ]);

    if (!stats.length) {
      return res.json({
        totalCashCollected: 0,
        transactionCount: 0,
        averageOrderValue: 0,
      });
    }

    const result = {
      totalCashCollected: stats[0].totalCashCollected,
      transactionCount: stats[0].transactionCount,
      averageOrderValue: Math.round(stats[0].averageOrderValue * 100) / 100,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    res.status(500).json({ error: "Failed to fetch transaction statistics" });
  }
}

module.exports = {
  createTransaction,
  getTransactionByOrder,
  getAllTransactions,
  getTransactionStats,
};
