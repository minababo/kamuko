const { Order } = require("../models/Order");
const OrderItem = require("../models/OrderItem");

async function getOverview(req, res) {
  try {
    const now = new Date();

    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 6);

    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 29);

    // 1) total orders
    const totalOrdersPromise = Order.countDocuments();

    // 2) orders by status
    const ordersByStatusPromise = Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
      { $sort: { status: 1 } },
    ]);

    // 3) total revenue
    const revenuePromise = Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      { $project: { _id: 0, totalRevenue: { $ifNull: ["$totalRevenue", 0] } } },
    ]);

    // 4) orders per day
    const ordersPerDayPromise = Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: "$_id", count: 1 } },
      { $sort: { date: 1 } },
    ]);

    // 5) top products
    const topProductsPromise = OrderItem.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "orderDoc",
        },
      },
      { $unwind: "$orderDoc" },
      { $match: { "orderDoc.createdAt": { $gte: last30Days } } },
      {
        $group: {
          _id: "$product",
          name: { $first: "$name" },
          quantity: { $sum: "$quantity" },
          revenue: { $sum: "$lineTotal" },
        },
      },
      { $project: { _id: 0, productId: "$_id", name: 1, quantity: 1, revenue: 1 } },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);

    const [
      totalOrders,
      ordersByStatus,
      revenueAgg,
      ordersPerDay,
      topProducts,
    ] = await Promise.all([
      totalOrdersPromise,
      ordersByStatusPromise,
      revenuePromise,
      ordersPerDayPromise,
      topProductsPromise,
    ]);

    const totalRevenue = revenueAgg?.[0]?.totalRevenue ?? 0;

    return res.json({
      totalOrders,
      ordersByStatus,
      totalRevenue,
      ordersPerDay,
      topProducts,
      windows: {
        ordersPerDayDays: 7,
        topProductsDays: 30,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load analytics", details: err.message });
  }
}

module.exports = { getOverview };