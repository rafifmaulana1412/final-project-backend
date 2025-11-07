const { Order, User, Menu, OrderMenu, Cart } = require("../models");

// ✅ GET ALL ORDERS (Admin & Staff lihat semua, Customer lihat order dia sendiri)
const getAllOrders = async (req, res) => {
  try {
    let whereCondition = {};

    // ✅ Jika role customer → hanya tampilkan order miliknya
    if (req.user.role === "customer") {
      whereCondition = { userId: req.user.id };
    }

    // ✅ Jika admin atau staff → tampilkan semua order (tanpa filter)
    const orders = await Order.findAll({
      where: whereCondition,
      include: [
        // ⚠️ ini yang harus diubah
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Menu, as: "menus", through: { model: OrderMenu } },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("❌ getAllOrders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ GET ORDER BY ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Menu,
          as: "menus",
          attributes: ["id", "name", "price", "image"],
          through: { attributes: ["quantity"] },
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.role === "customer" && order.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Access denied. You can only view your own orders." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ getOrderById error:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

// ✅ CREATE ORDER (Customer checkout)
const createOrder = async (req, res) => {
  const t = await Order.sequelize.transaction(); // Gunakan transaksi biar aman

  try {
    const { items, totalPrice, address, paymentMethod } = req.body;
    console.log("🧩 Request body received:", req.body);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!req.user || req.user.role !== "customer") {
      return res
        .status(403)
        .json({ error: "Only customers can create orders" });
    }

    // 1️⃣ Buat order utama
    const order = await Order.create(
      {
        userId: req.user.id,
        totalPrice: totalPrice || 0,
        address: address || null,
        paymentMethod: paymentMethod || null,
        status: "pending",
      },
      { transaction: t }
    );

    // 2️⃣ Siapkan data pivot OrderMenus
    const orderMenuData = items.map((item) => ({
      orderId: order.id,
      menuId: item.menuId || item.id,
      quantity: item.quantity || 1,
    }));

    console.log("🧾 OrderMenu data to insert:", orderMenuData);

    // 3️⃣ Pastikan menuId valid
    const validMenuIds = await Menu.findAll({
      where: { id: orderMenuData.map((i) => i.menuId) },
      attributes: ["id"],
    });

    if (validMenuIds.length !== orderMenuData.length) {
      await t.rollback();
      return res.status(400).json({ error: "Some menu IDs are invalid" });
    }

    // 4️⃣ Simpan ke tabel pivot
    await OrderMenu.bulkCreate(orderMenuData, { transaction: t });
    console.log("✅ OrderMenus successfully created!");

    // 5️⃣ Kosongkan cart user
    await Cart.destroy({ where: { userId: req.user.id }, transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Order created successfully",
      orderId: order.id,
    });
  } catch (error) {
    await t.rollback();
    console.error("❌ createOrder error:", error.name, error.message);
    console.error("🧠 Full stack:", error.stack);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
};
// ✅ UPDATE ORDER (Admin & Staff bisa update status)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Hanya admin dan staff yang boleh ubah status
    if (req.user.role === "admin" || req.user.role === "staff") {
      order.status = status || order.status;
      await order.save();
      res.status(200).json({ message: "Order updated successfully", order });
    } else {
      res
        .status(403)
        .json({ error: "Access denied. You cannot update orders." });
    }
  } catch (error) {
    console.error("❌ updateOrder error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// ✅ DELETE ORDER (Admin aja yang bisa hapus)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.role === "admin") {
      await order.destroy();
      res.status(200).json({ message: "Order deleted successfully" });
    } else {
      res
        .status(403)
        .json({ error: "Access denied. Only admin can delete orders." });
    }
  } catch (error) {
    console.error("❌ deleteOrder error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// ✅ SIMULATE PAYMENT (Customer menekan tombol Bayar)
const simulatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Pastikan hanya customer pemilik order yang bisa bayar
    if (req.user.role !== "customer" || order.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only pay for your own order." });
    }

    order.status = "success";
    await order.save();

    res.status(200).json({
      message: "✅ Payment successful. Order status updated to success.",
      order,
    });
  } catch (error) {
    console.error("❌ simulatePayment error:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
};

// ✅ EXPORT SEMUA (tanpa ubah struktur)
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  simulatePayment,
};
