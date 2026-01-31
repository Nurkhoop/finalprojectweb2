const Message = require("../models/Message");

// CREATE (admin)
exports.createMessage = async (req, res) => {
  try {
    const { chat, text } = req.body;

    if (!chat || !text) {
      return res.status(400).json({ message: "Chat and text required" });
    }

    const message = await Message.create({
      chat,
      sender: req.user.id,
      text
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ (public)
exports.getMessages = async (req, res) => {
  const messages = await Message.find()
    .populate("chat")
    .populate("sender", "email role");

  res.json(messages);
};

// READ ONE (public)
exports.getMessageById = async (req, res) => {
  const message = await Message.findById(req.params.id)
    .populate("chat")
    .populate("sender", "email role");

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(message);
};

// UPDATE (admin)
exports.updateMessage = async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { ...req.body, edited: true },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(message);
};

// DELETE (admin)
exports.deleteMessage = async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json({ message: "Message deleted" });
};