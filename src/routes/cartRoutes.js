const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cartController");

// Perbaiki path ke middleware — pastikan folder mu bernama "middleware" (bukan "middlewares")
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// =============================
// 🛒 CART ROUTES
// =============================

// Ambil cart user login
router.get("/", verifyToken, allowRoles("customer"), cartCtrl.getCart);

// Tambah item ke cart
router.post(
  "/add",
  verifyToken,
  allowRoles("customer"),
  cartCtrl.addToCart
);

// Hapus item dari cart
router.delete(
  "/:id",
  verifyToken,
  allowRoles("customer"),
  cartCtrl.removeFromCart
);

// Checkout cart
router.post(
  "/checkout",
  verifyToken,
  allowRoles("customer"),
  cartCtrl.checkout
);

module.exports = router;
