const Chat = require("../models/Chat");

// CREATE (admin)
exports.createChat = async (req, res) => {
  try {
    const { title, participants } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "At least 2 participants required" });
    }

    const chat = await Chat.create({
      title,
      participants,
      createdBy: req.user.id
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ (public)
exports.getChats = async (req, res) => {
  const chats = await Chat.find()
    .populate("participants", "email role")
    .populate("createdBy", "email");

  res.json(chats);
};

// READ ONE (public)
exports.getChatById = async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .populate("participants", "email role")
    .populate("createdBy", "email");

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json(chat);
};

// UPDATE (admin)
exports.updateChat = async (req, res) => {
  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json(chat);
};

// DELETE (admin)
exports.deleteChat = async (req, res) => {
  const chat = await Chat.findByIdAndDelete(req.params.id);

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  res.json({ message: "Chat deleted" });
};