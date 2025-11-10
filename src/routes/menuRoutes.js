const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploads);

// 🧭 ROUTES
router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);

// ✅ CREATE MENU (upload ke Cloudinary)
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "staff", "editor"),
  upload.single("image"),
  menuController.createMenu
);

// ✅ UPDATE MENU (upload baru ke Cloudinary)
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "editor"),
  upload.single("image"),
  menuController.updateMenu
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "editor"),
  menuController.deleteMenu
);

module.exports = router;
