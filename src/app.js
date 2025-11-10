const express = require("express");
const cors = require("cors");
const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { sequelize } = require("./models");
const menuRoutes = require("./routes/menuRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// ✅ aktifkan cors dulu
app.use(cors());

// ✅ parser JSON & urlencoded dulu, biar semua route dapet body parser yg benar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ serve folder uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ routes
app.use("/menus", menuRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/roles", roleRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `✅ Server running on http://localhost:${process.env.PORT || 3000}`
      );
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
};

start();
