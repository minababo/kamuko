const Category = require("../models/Category");

async function createCategory(req, res) {
  try {
    const category = await Category.create({ name: req.body.name });
    return res.status(201).json(category);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function listCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

async function updateCategory(req, res) {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Category not found" });
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

    if (!updated) return res.status(404).json({ error: "Category not found" });
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
};