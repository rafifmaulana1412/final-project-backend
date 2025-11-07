const { Role, User } = require("../models");

// ===============================
//  CREATE ROLE
// ===============================
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.create({ name, description });
    res.status(201).json({
      success: true,
      data: role,
      message: "Role created successfully",
    });
  } catch (err) {
    console.error("❌ Error creating role:", err.message);
    res.status(500).json({
      error: "Failed to create role",
      details: err.message,
    });
  }
};

// ===============================
//  GET ALL ROLES
// ===============================
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ["id", "name", "description"],
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve roles",
      details: err.message,
    });
  }
};

// ===============================
//  GET ROLE BY ID
// ===============================
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: {
        model: User,
        as: "users",
        attributes: ["id", "name", "email"],
        through: { attributes: [] }, // Hilangkan data pivot
      },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json(role);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve role",
      details: err.message,
    });
  }
};

// ===============================
//  UPDATE ROLE
// ===============================
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    role.name = name || role.name;
    role.description = description || role.description;
    await role.save();

    res.json(role);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update role",
      details: err.message,
    });
  }
};

// ===============================
//  DELETE ROLE
// ===============================
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    await role.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete role",
      details: err.message,
    });
  }
};

// ===============================
//  ASSIGN ROLE TO USER
// ===============================
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Add role ke user (many-to-many)
    await user.addRole(role);

    res.status(201).json({
      message: "Role assigned successfully",
      userId: user.id,
      roleId: role.id,
      roleName: role.name,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to assign role",
      details: err.message,
    });
  }
};

// ===============================
//  REMOVE ROLE FROM USER
// ===============================
exports.removeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Remove role dari user
    await user.removeRole(role);

    res.json({
      message: "Role removed successfully",
      userId: user.id,
      roleId: role.id,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to remove role",
      details: err.message,
    });
  }
};
