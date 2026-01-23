const Category = require("../models/Category");
const { writeAuditLog } = require("../utils/audit");

async function createCategory(req, res) {
  try {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description || "",
      displayOrder: req.body.displayOrder ?? 0,
      isActive: req.body.isActive ?? true,
    });

    await writeAuditLog({
      actorId: req.user._id,
      action: "category.created",
      entityType: "Category",
      entityId: category._id,
      meta: {
        name: category.name,
      },
    });

    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function listCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      displayOrder: 1,
      name: 1,
    });
    return res.json(categories);
  } catch {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

async function listAllCategories(req, res) {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
    return res.json(categories);
  } catch {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

async function updateCategory(req, res) {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.displayOrder !== undefined) updates.displayOrder = req.body.displayOrder;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    await writeAuditLog({
      actorId: req.user._id,
      action: "category.updated",
      entityType: "Category",
      entityId: updated._id,
      meta: {
        name: updated.name,
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    await writeAuditLog({
      actorId: req.user._id,
      action: "category.deleted",
      entityType: "Category",
      entityId: updated._id,
      meta: {
        name: updated.name,
      },
    });

    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createCategory,
  listCategories,
  listAllCategories,
  updateCategory,
  deleteCategory,
};
