const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cartController");

// ⚠️ perhatikan, sesuaikan nama folder di repo kamu
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// =============================
// 🛒 CART ROUTES
// =============================

// ✅ ambil cart user login
router.get("/", verifyToken, allowRoles("customer"), cartCtrl.getCart);

// ✅ tambah item ke cart
router.post("/add", verifyToken, allowRoles("customer"), cartCtrl.addToCart);

// ✅ hapus item dari cart
router.delete("/:id", verifyToken, allowRoles("customer"), cartCtrl.removeFromCart);

// ✅ checkout cart
router.post("/checkout", verifyToken, allowRoles("customer"), cartCtrl.checkout);

module.exports = router;
