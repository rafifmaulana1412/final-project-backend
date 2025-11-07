const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Menu = require("./menu");

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  }
);

module.exports = Category;
