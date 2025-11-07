const { User, Role } = require("../models");

exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: "User or Role not found" });
    }

    // ini magic dari sequelize
    await user.addRole(role);

    return res
      .status(200)
      .json({ message: `Role ${role.name} assigned to ${user.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserWithRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: {
        model: Role,
        as: "roles",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200);
    json({
      success: true,
      data: user,
      message: "User roles retrieved successfully",
    });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ error: "User atau Role tidak ditemukan" });
    }

    await user.addRole(role); // ⬅ ini otomatis isi tabel user_roles

    res.json({ message: "Role berhasil ditambahkan ke user" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal menambahkan role", details: error.message });
  }
};
