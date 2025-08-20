const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offeredSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  requestedSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected", "cancelled"], default: "pending" },
  expiresAt: { type: Date, required: true },  // 🔹 new field
  createdAt: { type: Date, default: Date.now }
});

// Optional: prevent duplicate pending requests for the same pair & skills
swapRequestSchema.index(
  { fromUser: 1, toUser: 1, offeredSkill: 1, requestedSkill: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
