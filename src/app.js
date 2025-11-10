const express = require("express");
const cors = require("cors");
const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);


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
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);

    await sequelize.authenticate();
    console.log("✅ Database connected");

      app.get("/", (req, res) => {
  res.send("🚀 Backend API is running successfully on Railway!");
});

    // Sync tabel hanya setelah berhasil konek
    await sequelize.sync({ alter: true });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

start();
