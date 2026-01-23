const Product = require("../models/Product");
const Category = require("../models/Category");
const { writeAuditLog } = require("../utils/audit");

async function createProduct(req, res) {
  try {
    const { name, description, price, imageUrl, category, isAvailable } = req.body;

    const cat = await Category.findOne({ _id: category, isActive: true });
    if (!cat) return res.status(400).json({ error: "Invalid category" });

    const product = await Product.create({
      name,
      description: description || "",
      price,
      imageUrl: imageUrl || "",
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    await writeAuditLog({
      actorId: req.user._id,
      action: "product.created",
      entityType: "Product",
      entityId: product._id,
      meta: {
        name: product.name,
        price: product.price,
        category: product.category,
        isAvailable: product.isAvailable,
      },
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function listProducts(req, res) {
  try {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.available === "true") filter.isAvailable = true;

    const products = await Product.find(filter)
      .populate("category", "name isActive")
      .sort({ createdAt: -1 });

    if (req.query.includeInactiveCategories === "true") {
      return res.json(products);
    }

    const visible = products.filter((product) => product.category?.isActive !== false);
    return res.json(visible);
  } catch {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate(
      "category",
      "name"
    );

    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch {
    return res.status(400).json({ error: "Invalid product id" });
  }
}

async function updateProduct(req, res) {
  try {
    const updates = { ...req.body };

    if (updates.category) {
      const cat = await Category.findOne({ _id: updates.category, isActive: true });
      if (!cat) return res.status(400).json({ error: "Invalid category" });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated || !updated.isActive) {
      return res.status(404).json({ error: "Product not found" });
    }

    await writeAuditLog({
      actorId: req.user._id,
      action: "product.updated",
      entityType: "Product",
      entityId: updated._id,
      meta: {
        name: updated.name,
        price: updated.price,
        category: updated.category,
        isAvailable: updated.isAvailable,
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Product not found" });

    await writeAuditLog({
      actorId: req.user._id,
      action: "product.deleted",
      entityType: "Product",
      entityId: updated._id,
      meta: {
        name: updated.name,
        price: updated.price,
        category: updated.category,
      },
    });

    return res.json({ message: "Product deleted" });
  } catch {
    return res.status(400).json({ error: "Invalid product id" });
  }
}

async function listFeaturedProducts(req, res) {
  try {
    const products = await Product.find({ isActive: true, isAvailable: true, isFeatured: true })
      .sort({ updatedAt: -1 });
    return res.json(products);
  } catch {
    return res.status(500).json({ error: "Failed to fetch featured products" });
  }
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  listFeaturedProducts,
};
