const { Order, ORDER_STATUS } = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const { getNextOrderNumber } = require("../services/orders.service");
const StoreSettings = require("../models/StoreSettings");
const { emitOrderStatus } = require("../sockets");

async function checkout(req, res) {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({ orderingOpen: true, closedMessage: "" });
    }

    if (!settings.orderingOpen) {
      return res.status(403).json({
        error: "Ordering is currently closed",
        message: settings.closedMessage || "Ordering is currently closed",
      });
    }

    const { customerNote } = req.body || {};

    const cart = await Cart.findOne({ user: req.user._id, isActive: true });
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    const cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    if (!cartItems.length) return res.status(400).json({ error: "Cart is empty" });

    // Validate products still active/available
    for (const item of cartItems) {
      const product = await Product.findOne({ _id: item.product._id, isActive: true });
      if (!product) {
        return res.status(400).json({ error: "One or more products are no longer available" });
      }
      if (!product.isAvailable) {
        return res.status(400).json({ error: "One or more products are currently unavailable" });
      }
    }

    const orderNumber = await getNextOrderNumber();

    let subtotal = 0;
    const orderItemsPayload = cartItems.map((ci) => {
      const unitPrice = ci.product.price;
      const lineTotal = unitPrice * ci.quantity;
      subtotal += lineTotal;

      return {
        product: ci.product._id,
        name: ci.product.name,
        unitPrice,
        quantity: ci.quantity,
        note: ci.note || "",
        lineTotal,
      };
    });

    const total = subtotal;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      subtotal,
      total,
      customerNote: customerNote || "",
      paymentMethod: "cash",
      status: ORDER_STATUS.PLACED,
    });

    await OrderItem.insertMany(
      orderItemsPayload.map((oi) => ({ ...oi, order: order._id }))
    );

    // Clear cart after successful order creation
    await CartItem.deleteMany({ cart: cart._id });

    return res.status(201).json({
      message: "Order placed",
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Customer order history
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(orders);
  } catch {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}

async function getMyOrderById(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });

    const items = await OrderItem.find({ order: order._id }).lean();
    return res.json({ ...order, items });
  } catch {
    return res.status(400).json({ error: "Invalid order id" });
  }
}

// Staff view
async function listOrders(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// Staff update status
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    // Emit realtime status update to the customer room
    const io = req.app.get("io");
    if (io) {
      emitOrderStatus(io, order.user.toString(), {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        updatedAt: order.updatedAt,
      });
    }

    return res.json({
      message: "Status updated",
      orderId: order._id,
      status: order.status,
    });
  } catch {
    return res.status(400).json({ error: "Invalid order id" });
  }
}

module.exports = {
  checkout,
  getMyOrders,
  getMyOrderById,
  listOrders,
  updateOrderStatus,
};