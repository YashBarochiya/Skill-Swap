const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillFromUser1: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  skillFromUser2: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  agreementConfirmedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // store both confirmations
  startDate: Date,
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Swap", swapSchema);
