const { Category } = require("../models");

// ✅ GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "createdAt", "updatedAt"],
      order: [["id", "ASC"]],
    });

    res.json(categories);
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
};

// ✅ GET CATEGORY BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error("❌ Error fetching category:", err);
    res.status(500).json({ error: "Failed to retrieve category" });
  }
};

// ✅ CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    console.error("❌ Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// ✅ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.update({ name });
    res.json(category);
  } catch (err) {
    console.error("❌ Error updating category:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// ✅ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
