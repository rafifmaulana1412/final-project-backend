const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/categoryController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Semua user (bahkan tanpa login) bisa lihat kategori
router.get("/", ctrl.getAllCategories);
router.get("/:id", ctrl.getCategoryById);

// staff, Editor dan Admin boleh tambah categori
router.post(
  "/",
  verifyToken,
  allowRoles("admin, editor, staff"),
  ctrl.createCategory
);

// Editor dan Admin boleh update category
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin, editor"),
  ctrl.updateCategory
);

//Editor dan Admin boleh hapus category
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin, editor"),
  ctrl.deleteCategory
);

module.exports = router;
