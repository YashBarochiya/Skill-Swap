const Profile = require("../models/Profile");
const User = require("../models/User");

exports.getAllprofiles = async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
//  Update Profile
exports.upsertProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const { bio, location, experience,learnSkills } = req.body;
    let profile = await Profile.findOne({ user: userId });
    if(!profile) return res.status(404).json({ message: "Profile not found" });
    console.log("find profile")
    if (
      profile.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to Update this Profile" });
    }
    console.log("authorized")

    if (profile) {
      profile.bio = bio || profile.bio;
      profile.location = location || profile.location;
      profile.experience = experience || profile.experience;
      profile.learnSkills = learnSkills || profile.learnSkills
      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message)
  }
};

// Get Current User Profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate("user", "name email")
      .populate("teachSkills","name level");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Profile by User ID (public)
exports.getProfileByUserId = async (req, res) => {
  try {
    const {userId} = req.params
    const profile = await Profile.findOne({user:userId})
      .populate("user","name email")
      .populate("teachSkills","name level")
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message)
  }
};
