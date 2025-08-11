const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offeredSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  requestedSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
