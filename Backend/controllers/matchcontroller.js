const Profile = require("../models/Profile")

// controllers/matchController.js
exports.findMatches = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user.id });

    if (!myProfile) return res.status(404).json({ message: "Profile not found" });

    // Match condition: I want to learn X, and others can teach X
    const matches = await Profile.find({
      teachSkills: { $in: myProfile.learnSkills },
      learnSkills: { $in: myProfile.teachSkills },
      user: { $ne: req.user.id } // exclude self
    }).populate("user", "name email");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
