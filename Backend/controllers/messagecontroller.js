// controllers/messageController.js

const { default: mongoose } = require("mongoose");
const Message = require("../models/Message");
const Swap = require("../models/Swap");

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { swapId, receiver, content } = req.body;

     const swap = await Swap.findById(swapId);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    // only participants can send messages
    if (![swap.fromUser.toString(), swap.toUser.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: "You are not part of this swap" });
    }

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

    const swap = await Swap.findById(swapId);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    // only participants can read messages
    if (![swap.fromUser.toString(), swap.toUser.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: "You are not part of this swap" });
    }
    
    const messages = await Message.find({ swap: swapId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// mark messages as read
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { swapId } = req.body;

const result = await Message.updateMany(
      { 
        swap: swapId,
        receiver: req.user.id,
        read: false
      },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Messages marked as read", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

