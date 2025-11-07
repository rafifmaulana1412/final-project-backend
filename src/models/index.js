const { sequelize } = require("../config/database");
const Category = require("./category");
const Menu = require("./menu");
const User = require("./user");
const Order = require("./order");
const Role = require("./role");
const UserRole = require("./userRole");
const Cart = require("./cart");
const OrderMenu = require("./orderMenu"); // ✅ tambahkan ini

// ===============================
//  Relasi Category ↔ Menu
// ===============================
Category.hasMany(Menu, { foreignKey: "categoryId", as: "categoryMenus" });
Menu.belongsTo(Category, { foreignKey: "categoryId", as: "menuCategory" });

// ===============================
//  Relasi User ↔ Order
// ===============================
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// ===============================
//  Relasi Order ↔ Menu (Many-to-Many via OrderMenu)
// ===============================
Order.belongsToMany(Menu, {
  through: OrderMenu, // ✅ gunakan model langsung, bukan string
  as: "menus",
  foreignKey: "orderId",
});

Menu.belongsToMany(Order, {
  through: OrderMenu,
  as: "orders",
  foreignKey: "menuId",
});

// ===============================
//  Relasi User ↔ Role (Many-to-Many)
// ===============================
User.belongsToMany(Role, {
  through: UserRole,
  as: "roles",
  foreignKey: "userId",
});

Role.belongsToMany(User, {
  through: UserRole,
  as: "Users",
  foreignKey: "roleId",
});

// ===============================
//  Relasi User ↔ Cart ↔ Menu
// ===============================
User.hasMany(Cart, { foreignKey: "userId", as: "carts" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

Menu.hasMany(Cart, { foreignKey: "menuId", as: "cartMenus" });
Cart.belongsTo(Menu, { foreignKey: "menuId", as: "menu" });

// ===============================
//  EXPORT SEMUA MODEL
// ===============================
module.exports = {
  sequelize,
  Category,
  Menu,
  User,
  Order,
  OrderMenu, // ✅ pastikan diekspor
  Role,
  UserRole,
  Cart,
};
