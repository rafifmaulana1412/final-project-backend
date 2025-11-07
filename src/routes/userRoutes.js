const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");

router.post("/", ctrl.createUser);
router.get("/", ctrl.getAllUsers);
router.get("/:id", ctrl.getUserById);
router.get("/:id/roles", ctrl.getUserRoles);
router.get("/roles/all", ctrl.getAllUsersWithRoles);
router.put("/:id", ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);

module.exports = router;
