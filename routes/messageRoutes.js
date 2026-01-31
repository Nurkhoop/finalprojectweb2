const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// public
router.get("/", messageController.getMessages);
router.get("/:id", messageController.getMessageById);

// admin protected
router.post("/", authMiddleware, adminOnly, messageController.createMessage);
router.put("/:id", authMiddleware, adminOnly, messageController.updateMessage);
router.delete("/:id", authMiddleware, adminOnly, messageController.deleteMessage);

module.exports = router;