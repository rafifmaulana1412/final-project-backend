const { User, Order, Menu, Role } = require("../models");

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    //validasi minimal
    const validRoles = ["admin", "staff", "editor", "customer"];
    const roleName = role && validRoles.includes(role) ? role : "customer";

    // buat user
    const user = await user.create({ name, email, password });

    // cari role yang sesuai
    const roleRecord = await role.findOne({ where: { name: roleName } });
    if (!roleRecord) {
      // jika role belum ada, rollback user dan kembalikan error
      await user.destroy();
      return res.status(400).json({ error: "Invalid role" });
    }

    // buat relasi UserRole(pivot)
    await UserRole.create({
      userId: user.id,
      roleId: roleRecord.id,
    });

    // kembalikan user(boleh mask password jika ada)
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      assignedRole: roleRecord.name,
    });
  } catch (err) {
    console.error("Failed createUser", err);
    res
      .status(500)
      .json({ error: "Failed to create user", detail: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "phone"],
      include: {
        model: Order,
        as: "orders",
        required: false,
        attributes: ["id", "quantity", "totalPrice"],
        include: {
          model: Menu,
          as: "menu",
          required: false,
          attributes: ["id", "name", "price"],
        },
      },
    });
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err.message);
    res.status(500).json({
      error: "Failed to retrieve users",
      details: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Order,
        as: "orders",
        include: { model: Menu, as: "menu" },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve user", details: err.message });
  }
};

// ===============================
//  GET ALL ROLES BY USER ID
// ===============================
exports.getUserRoles = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      userId: user.id,
      userName: user.name,
      roles: user.roles,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve user roles",
      details: error.message,
    });
  }
};

// ===============================
//  GET ALL USERS WITH ROLES
// ===============================
exports.getAllUsersWithRoles = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] }, // Hilangkan data pivot userRoles
        },
      ],
    });

    const formatted = users.map((user) => ({
      userId: user.id,
      userName: user.name,
      roles: user.roles,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve users with roles",
      details: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete user", details: err.message });
  }
};
