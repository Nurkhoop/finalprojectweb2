const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// admin only
router.get("/:id", authMiddleware, adminOnly, userController.getUserById);
router.put("/:id", authMiddleware, adminOnly, userController.updateUser);
router.delete("/:id", authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;