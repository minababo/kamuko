const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId, isActive: true });
  if (!cart) {
    cart = await Cart.create({ user: userId });
  }
  return cart;
}

async function getMyCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user._id);

    const items = await CartItem.find({ cart: cart._id })
      .populate("product", "name price imageUrl isAvailable isActive")
      .sort({ createdAt: 1 });

    return res.json({
      cartId: cart._id,
      items,
    });
  } catch {
    return res.status(500).json({ error: "Failed to load cart" });
  }
}

// Add item
async function addToCart(req, res) {
  try {
    const { productId, quantity, note } = req.body;

    if (!productId) return res.status(400).json({ error: "productId is required" });

    const qty = quantity ? Number(quantity) : 1;
    if (Number.isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: "quantity must be >= 1" });
    }

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (!product.isAvailable) return res.status(400).json({ error: "Product is not available" });

    const cart = await getOrCreateCart(req.user._id);

    // Upsert: if item exists, increment qty, else create
    const existing = await CartItem.findOne({ cart: cart._id, product: productId });

    if (existing) {
      existing.quantity += qty;
      if (note !== undefined) existing.note = note;
      await existing.save();
    } else {
      await CartItem.create({
        cart: cart._id,
        product: productId,
        quantity: qty,
        note: note || "",
      });
    }

    return getMyCart(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Update item quantity and/or note
async function updateCartItem(req, res) {
  try {
    const { id } = req.params;
    const { quantity, note } = req.body;

    const cart = await getOrCreateCart(req.user._id);

    const item = await CartItem.findOne({ _id: id, cart: cart._id });
    if (!item) return res.status(404).json({ error: "Cart item not found" });

    if (quantity !== undefined) {
      const qty = Number(quantity);
      if (Number.isNaN(qty) || qty < 1) {
        return res.status(400).json({ error: "quantity must be >= 1" });
      }
      item.quantity = qty;
    }

    if (note !== undefined) {
      item.note = note;
    }

    await item.save();
    return getMyCart(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Remove an item from cart
async function removeCartItem(req, res) {
  try {
    const { id } = req.params;
    const cart = await getOrCreateCart(req.user._id);

    const deleted = await CartItem.findOneAndDelete({ _id: id, cart: cart._id });
    if (!deleted) return res.status(404).json({ error: "Cart item not found" });

    return getMyCart(req, res);
  } catch {
    return res.status(400).json({ error: "Invalid cart item id" });
  }
}

// Clear cart
async function clearCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await CartItem.deleteMany({ cart: cart._id });
    return getMyCart(req, res);
  } catch {
    return res.status(500).json({ error: "Failed to clear cart" });
  }
}

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
