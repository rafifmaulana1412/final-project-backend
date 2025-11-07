const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Category = require("./category");

const Menu = sequelize.define(
  "Menu",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "menus",
    timestamps: true,
  }
);

module.exports = Menu;
