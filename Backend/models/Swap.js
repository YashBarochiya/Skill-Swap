const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillFromUser1: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  skillFromUser2: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  agreementConfirmedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // store both confirmations
  startDate: Date,
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["pending", "active", "rejected", "completed"], 
    default: "pending" },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Swap", swapSchema);
