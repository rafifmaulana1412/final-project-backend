const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "user_roles", // atau "userRoles" sesuai database Anda
    timestamps: true,
  }
);

module.exports = UserRole;
