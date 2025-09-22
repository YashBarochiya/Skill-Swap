
const SwapRequest = require("../models/SwapRequest");
const Swap = require("../models/Swap");
const User = require("../models/User");

exports.createSwapRequest = async (req,res)=>{
    try {
    const { toUser, offeredSkill, requestedSkill } = req.body;

    const findReceiverUser = await User.findById(toUser);
    if(!findReceiverUser) return res.status(400).json({message:"Receiver not found"});
    if (req.user.id === toUser) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }


    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);


    const newRequest = await SwapRequest.create({
      fromUser: req.user.id,
      toUser,
      offeredSkill,
      requestedSkill,
      expiresAt
    });

    res.status(201).json({ message: "Swap request sent", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.receivedRequest = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ toUser: req.user.id })
      .populate("fromUser", "name email")
      .populate("offeredSkill requestedSkill", "name level");

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.sentRequest = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ fromUser: req.user.id })
      .populate("fromUser","name email")
      .populate("toUser", "name email")
      .populate("offeredSkill requestedSkill", "name level")
      .populate("requestedSkill","name level");

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id, status } = req.params;   // ✅ FIXED

    const valid = ["accepted", "rejected", "cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await SwapRequest.findById(id);
    console.log(request);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (new Date() > request.expiresAt) {
    return res.status(400).json({ message: "This swap request has expired (max 5 days validity)" });
    }
    const userId = req.user.id;
    const isSender = request.fromUser.toString() === userId;
    const isRecipient = request.toUser.toString() === userId;

    if (status === "accepted" || status === "rejected") {
      if (!isRecipient) {
        return res.status(403).json({ message: "Only the recipient can accept or reject." });
      }
    }

    if (status === "cancelled") {
      if (!isSender) {
        return res.status(403).json({ message: "Only the sender can cancel the request." });
      }
    }

    if (request.status !== "pending") {
      return res.status(401).json({ message: "Only pending requests can be updated." });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const swap = await Swap.create({
        fromUser: request.fromUser,
        toUser: request.toUser,
        skillFromUser1: request.offeredSkill,
        skillFromUser2: request.requestedSkill,
        status: "pending",
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        agreementConfirmedBy: [],
        completedBy:[],
      });

      return res.status(200).json({ message: "Request accepted. Swap created.", request, swap });
    }

    res.json({ message: `Request ${status}`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
