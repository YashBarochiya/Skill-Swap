const Swap = require("../models/Swap");



// GET /api/swaps/my
exports.getMySwaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const swaps = await Swap.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("fromUser toUser", "name email")
      .populate("skillFromUser1 skillFromUser2", "name level description")
      .sort({ createdAt: -1 });

    res.status(200).json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/swaps/:id/confirm
exports.confirmAgreement = async (req, res) => {
  try {
    const userId = req.user.id;
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    
    const isParticipant =
      swap.fromUser.toString() === userId || swap.toUser.toString() === userId;
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    if (swap.status !== "pending") {
      return res.status(400).json({ message: "Only pending swaps can be confirmed." });
    }
    if(new Date > swap.expiresAt){
       return res.status(400).json({ message: "This swap has expired (max 5 days validity)" });
    }
    if (!swap.agreementConfirmedBy.map(String).includes(userId)) {
      swap.agreementConfirmedBy.push(userId);
    }

    if (swap.agreementConfirmedBy.length === 2) {
      swap.status = "active";
      swap.startDate = new Date();
    }

    await swap.save();
    res.json({ message: "Agreement confirmed.", status: swap.status, swap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/swaps/:id/cancel
exports.cancelSwap = async (req, res) => {
  try {
    const userId = req.user.id;
    const {id} = req.params
    
    const swap = await Swap.findById(id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    if (
      swap.fromUser.toString() !== userId &&
      swap.toUser.toString() !== userId
    ) {
      return res.status(403).json({ message: "You are not a participant of this swap" });
    }
    console.log("done")
    if (swap.status !== "pending" ) {
      return res.status(400).json({ message: "Only pending swaps can be cancelled." });
    }

    if(new Date > swap.expiresAt){
       return res.status(400).json({ message: "This swap has expired (max 5 days validity)" });
    }

    swap.status = "rejected";
    await swap.save();
    res.json({ message: "Swap cancelled.", swap });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

// POST /api/swaps/:id/complete
exports.completeSwap = async (req, res) => {
  try {
    const userId = req.user.id;
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    const isParticipant =
      swap.fromUser.toString() === userId || swap.toUser.toString() === userId;
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    if (swap.status !== "active") {
      return res.status(400).json({ message: "Only accepted swaps can be completed." });
    }

    // reuse agreementConfirmedBy to collect completion confirmations
    if (!swap.completedBy.map(String).includes(userId)) {
      swap.completedBy.push(userId);
    }else{
      res.json({message:"You have already completed recored"});
    }

    if (swap.completedBy.length === 2) {
      swap.status = "completed";
    }

    await swap.save();
    res.json({ message: "Completion recorded.", status: swap.status, swap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
