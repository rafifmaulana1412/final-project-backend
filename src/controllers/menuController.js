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

// ✅ CREATE MENU (pakai Cloudinary)
exports.createMenu = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    console.log("📥 Body:", req.body);
    console.log("📸 File:", req.file);

    const imageUrl = req.file?.path || null;

    const newMenu = await Menu.create({
      name,
      price,
      description,
      categoryId,
      image: imageUrl,
    });

    res.status(201).json(newMenu);
  } catch (error) {
    console.error("❌ Error creating menu:", JSON.stringify(error, null, 2));
      console.error("🧩 Full error detail:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
      stack: error.stack,
    });
  }
};


// ✅ UPDATE MENU
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, description } = req.body;

    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    const newImage = req.file ? req.file.path : menu.image; // pakai Cloudinary path kalau ada upload baru

    await menu.update({
      name,
      price,
      categoryId,
      description,
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
