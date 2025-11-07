const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/roleController");

// CRUD Role
router.post("/", ctrl.createRole);
router.get("/", ctrl.getAllRoles);
router.get("/:id", ctrl.getRoleById);
router.put("/:id", ctrl.updateRole);
router.delete("/:id", ctrl.deleteRole);

// Assign/Remove Role ke User
router.post("/assign", ctrl.assignRoleToUser);
router.post("/remove", ctrl.removeRoleFromUser);

module.exports = router;
