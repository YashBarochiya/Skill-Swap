const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

// controllers/matchController.js
exports.matchUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get the profile of the requesting user
    const profile = await Profile.findOne( {user: userId}).populate("teachSkills", "name");
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Extract skills the user wants to learn
    const learnSkills = profile.learnSkills; // this is an array of names ["Python", "Django"]

    if (!learnSkills || learnSkills.length === 0) {
      return res.status(400).json({ message: "User has no learn skills defined" });
    }
    console.log("done here")
    // Step 1: Get Skill ObjectIds for learnSkills
    const skillDocs = await Skill.find({ name: { $in: learnSkills } });
    const skillIds = skillDocs.map(s => s._id);

    // Step 2: Find other profiles whose teachSkills contain any of these skillIds
    const matches = await Profile.find({
      user: { $ne: userId }, // exclude self
      teachSkills: { $in: skillIds }
    })
      .populate("user", "name email")
      .populate("teachSkills", "name");

    res.json({
      message: "Matching profiles found",
      matches
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

