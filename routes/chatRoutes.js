const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// public
router.get("/", chatController.getChats);
router.get("/:id", chatController.getChatById);

// admin protected
router.post("/", authMiddleware, adminOnly, chatController.createChat);
router.put("/:id", authMiddleware, adminOnly, chatController.updateChat);
router.delete("/:id", authMiddleware, adminOnly, chatController.deleteChat);

module.exports = router;