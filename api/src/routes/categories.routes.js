const express = require("express");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../utils/constants");

const {
  createCategory,
  listCategories,
  listAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

const router = express.Router();

router.get("/categories", listCategories);
router.get(
  "/categories/all",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  listAllCategories
);

router.post(
  "/categories",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  createCategory
);

router.put(
  "/categories/:id",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  updateCategory
);

router.patch(
  "/categories/:id",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  updateCategory
);

router.delete(
  "/categories/:id",
  authenticate,
  requireRole(ROLES.MANAGER, ROLES.ADMIN),
  deleteCategory
);

module.exports = router;
