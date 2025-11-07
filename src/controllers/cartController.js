const { Cart, Menu, Order } = require("../models");

// =========================
// ✅ Ambil cart user via endpoint GET /cart
// =========================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Menu,
          as: "menu",
          include: ["menuCategory"],
        },
      ],
    });

    res.json(cartItems);
  } catch (error) {
    console.error("❌ Failed to get cart items:", error);
    res.status(500).json({ message: "Failed to get cart items" });
  }
};

// =========================
// 🛒 Ambil semua item di cart user (fungsi utilitas internal)
// =========================
exports.getCartItems = async (userId) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Menu,
          as: "menu",
          include: ["menuCategory"],
        },
      ],
    });
    return cartItems;
  } catch (error) {
    console.error("❌ Error fetching cart items:", error);
    throw error;
  }
};

// ➕ Tambah item ke cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuId, quantity } = req.body;

    if (!menuId || !quantity)
      return res
        .status(400)
        .json({ message: "menuId and quantity are required" });

    const existing = await Cart.findOne({ where: { userId, menuId } });

    if (existing) {
      existing.quantity += parseInt(quantity);
      await existing.save();
    } else {
      await Cart.create({ userId, menuId, quantity });
    }

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("❌ Add to cart failed:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// 🗑 Hapus satu item dari cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findByPk(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy();
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("❌ Remove item error:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// 💳 Checkout semua item dari cart
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Menu, as: "menu" }],
    });

    if (!cartItems.length)
      return res.status(400).json({ message: "Cart is empty" });

    // ✅ Tambahkan pengecekan harga agar tidak undefined
    const total = cartItems.reduce((sum, item) => {
      const price = item.menu?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);

    // ✅ Pastikan Order model punya kolom totalPrice
    const firstMenu = cartItems[0].menuId;

    const newOrder = await Order.create({
      userId,
      menuId: firstMenu,
      totalPrice: total,
      status: "pending",
    });

    // ✅ Hapus semua item di cart setelah checkout
    await Cart.destroy({ where: { userId } });

    res.status(201).json({
      success: true,
      message: "Checkout successful",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    // Tambahkan log error lengkap biar gampang tracing
    console.error(error.stack);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};
