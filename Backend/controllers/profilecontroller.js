const  Profile  = require("../models/Profile");



exports.getAllprofiles = async (req,res)=>{
  try{const profiles = await Profile.find({});
  res.status(200).json(profiles);}
  catch(error){
    res.status(500).json({ message: err.message });
  }

}
//  Update Profile
exports.upsertProfile = async (req, res) => {
  try {
    const {userId} = req.params;

    const { bio, location, experience } = req.body;
    let profile = await Profile.findOne({user:userId});

    if(profile.user.toString()!==req.user._id.toString() && req.user.role !== "admin"){
      return res.status(403).json({ message: "Not authorized to Update this Profile" });
    }

    if (profile) {
      profile.bio = bio || profile.bio;
      profile.location = location || profile.location;
      profile.experience = experience || profile.experience;
      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }



    res.status(201).json({ message: "Profile created", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Current User Profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Profile by User ID (public)
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate("user", "name email");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




