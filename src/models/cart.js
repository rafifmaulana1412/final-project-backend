const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cart = sequelize.define("Cart", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // ✅ referensi ke tabel users
      key: "id",
    },
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "menus", // ✅ bukan categories!!
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

module.exports = Cart;
