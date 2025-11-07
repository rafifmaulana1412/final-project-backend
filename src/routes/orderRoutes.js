const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// ✅ Semua order (admin & staff bisa lihat semua, customer hanya lihat sendiri)
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "staff", "customer"),
  ctrl.getAllOrders
);

// ✅ Order by ID
router.get("/:id", verifyToken, ctrl.getOrderById);

// ✅ Buat order
router.post("/", verifyToken, allowRoles("customer"), ctrl.createOrder);

// ✅ Update order (admin atau staff)
router.put("/:id", verifyToken, allowRoles("admin", "staff"), ctrl.updateOrder);

// ✅ Hapus order (admin aja)
router.delete("/:id", verifyToken, allowRoles("admin"), ctrl.deleteOrder);

// ✅ Simulasi pembayaran (customer menekan "Bayar Sekarang")
router.post(
  "/:id/pay",
  verifyToken,
  allowRoles("customer"),
  ctrl.simulatePayment
);

module.exports = router;
