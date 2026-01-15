const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/cart", authenticate, requireRole(ROLES.CUSTOMER), getMyCart);
router.post("/cart/items", authenticate, requireRole(ROLES.CUSTOMER), addToCart);
router.put("/cart/items/:id", authenticate, requireRole(ROLES.CUSTOMER), updateCartItem);
router.delete("/cart/items/:id", authenticate, requireRole(ROLES.CUSTOMER), removeCartItem);
router.delete("/cart", authenticate, requireRole(ROLES.CUSTOMER), clearCart);

module.exports = router;