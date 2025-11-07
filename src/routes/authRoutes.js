const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ==========================
// REGISTER per ROLE
// ==========================
router.post("/register-admin", authController.registerAdmin);
router.post("/register-staff", authController.registerStaff);
router.post("/register-editor", authController.registerEditor);
router.post("/register-customer", authController.registerCustomer);

// ==========================
// LOGIN per ROLE
// ==========================
router.post("/login-admin", authController.loginAdmin);
router.post("/login-staff", authController.loginStaff);
router.post("/login-editor", authController.loginEditor);
router.post("/login-customer", authController.loginCustomer);

// ==========================
// UNIVERSAL LOGIN (opsional)
// ==========================
router.post("/login", authController.login);
module.exports = router;
