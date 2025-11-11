const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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

// ✅ pastikan folder uploads dibuat di awal
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Folder 'uploads' dibuat di:", uploadPath);
}

// ✅ aktifkan CORS lebih awal
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ serve folder uploads sebelum semua route lain
app.use("/uploads", express.static(uploadPath));

// ✅ test sync manual (optional)
app.post("/sync-db", async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    res.status(200).json({ message: "✅ DB synced to Railway" });
  } catch (error) {
    console.error("❌ Database sync failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ semua routes utama
app.use("/menus", menuRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/roles", roleRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

// ✅ tes homepage
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running successfully on Railway!");
});

// ✅ jalankan server
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

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
