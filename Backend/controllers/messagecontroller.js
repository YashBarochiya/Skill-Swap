// controllers/messageController.js
const Message = require("../models/Message");

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { swapId, receiver, content } = req.body;

    const message = await Message.create({
      swap: swapId,
      sender: req.user.id,
      receiver,
      content,
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages for a swap (chat history)
exports.getMessages = async (req, res) => {
  try {
    const { swapId } = req.params;

    const messages = await Message.find({ swap: swapId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
