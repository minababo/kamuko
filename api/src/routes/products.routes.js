const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  listFeaturedProducts,
} = require("../controllers/products.controller");

const router = express.Router();

// Public menu browsing
router.get("/products", listProducts);
router.get("/products/featured", listFeaturedProducts);
router.get("/products/:id", getProductById);

// Manager/Admin only for modifications
router.post(
  "/products",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  createProduct
);

router.put(
  "/products/:id",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  updateProduct
);

router.patch(
  "/products/:id",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  updateProduct
);

router.delete(
  "/products/:id",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  deleteProduct
);

module.exports = router;
