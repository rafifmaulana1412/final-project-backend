const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Order = require("./order");
const Menu = require("./menu");

const OrderMenu = sequelize.define(
  "OrderMenu",
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: Order, key: "id" },
    },
    menuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: Menu, key: "id" },
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "OrderMenus",
    timestamps: true,
  }
);

module.exports = OrderMenu;
