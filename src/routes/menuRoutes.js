const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require("../controllers/menuController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// 🧩 SETUP MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, "menu-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// 🧭 ROUTES
router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);

router.post(
  "/",
  upload.single("image"), // 🔥 multer harus pertama sebelum token
  verifyToken,
  allowRoles("admin", "staff", "editor"),
  menuController.createMenu
);

router.put(
  "/:id",
  upload.single("image"),
  verifyToken,
  allowRoles("admin", "editor"),
  menuController.updateMenu
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "editor"),
  menuController.deleteMenu
);

module.exports = router;
