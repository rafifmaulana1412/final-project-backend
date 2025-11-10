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
    console.log("====== 📥 CREATE MENU REQUEST ======");
    console.log("📦 Body:", req.body);
    console.log("🖼️ File:", req.file);

    const { name, price, description, categoryId } = req.body;

    if (!req.file) {
      console.warn("⚠️ No file uploaded!");
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newMenu = await Menu.create({
      name,
      price,
      description,
      categoryId,
      image: imageUrl,
    });

    console.log("✅ Menu created:", newMenu);
    res.status(201).json(newMenu);
  } catch (error) {
    console.log("====== ❌ ERROR LOG START ======");
    console.log("📛 Raw error (direct):", error);
    console.log("📛 Error keys:", Object.keys(error));
    console.log("📛 Error message:", error.message);
    console.log("📛 Error stack:", error.stack);
    console.log("📛 Stringified error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.log("====== ❌ ERROR LOG END ======");

    res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error",
      details: error.errors || null,
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

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

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
