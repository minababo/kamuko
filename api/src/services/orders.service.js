const { Order } = require("../models/Order");

async function getNextOrderNumber() {
  const last = await Order.findOne().sort({ orderNumber: -1 }).select("orderNumber").lean();
  return last ? last.orderNumber + 1 : 1001;
}

module.exports = { getNextOrderNumber };