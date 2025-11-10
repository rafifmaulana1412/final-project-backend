const { Menu, Category } = require("../models");

// ✅ GET ALL MENUS
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [
        { model: Category, as: "menuCategory", attributes: ["id", "name"] },
      ],
      order: [["id", "ASC"]],
    });
    res.json(menus);
  } catch (err) {
    console.error("❌ Error fetching menus:", err);
    res.status(500).json({ error: "Failed to retrieve menus" });
  }
};

// ✅ GET MENU BY ID
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id, {
      include: [
        { model: Category, as: "menuCategory", attributes: ["id", "name"] },
      ],
    });
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (err) {
    console.error("❌ Error fetching menu by ID:", err);
    res.status(500).json({ error: "Failed to retrieve menu" });
  }
};

// ✅ CREATE MENU
exports.createMenu = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    console.log("📥 Body:", req.body);
    console.log("📸 File:", req.file);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newMenu = await Menu.create({
      name,
      price,
      description,
      categoryId,
      image: imageUrl,
    });

    res.status(201).json(newMenu);
  } catch (error) {
    console.error("❌ Error creating menu:", error);
    res.status(500).json({
      message: "Server error saat membuat menu",
      error: error.message,
    });
  }
};

// ✅ UPDATE MENU
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId } = req.body;

    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    // kalau user upload gambar baru, pakai file baru
    const newImage = req.file ? `/uploads/${req.file.filename}` : menu.image;

    await menu.update({
      name,
      price,
      description,
      categoryId,
      image: newImage,
    });

    res.json(menu);
  } catch (err) {
    console.error("❌ Error updating menu:", err);
    res.status(500).json({ error: "Failed to update menu" });
  }
};

// ✅ DELETE MENU
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    await menu.destroy();
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting menu:", err);
    res.status(500).json({ error: "Failed to delete menu" });
  }
};
