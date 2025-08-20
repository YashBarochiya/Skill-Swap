const Skill = require("../models/Skill");
const User = require("../models/User");
const Profile = require("../models/Profile");

exports.getallSkill = async (req,res)=>{
  try{
    const skills = await Skill.find({});
    res.status(200).json(skills);
  }catch(error){
     res.status(500).json({ message: error.message });
  }
};

// Add a new skill
exports.addSkill = async (req, res) => {
  try {
    const { name, description, level } = req.body;
    const userId = req.user._id; 
    
    const existingSkill = await Skill.findOne({ name, level, user: userId });
    if (existingSkill) {
      return res.status(400).json({ message: "Skill with this name and level already exists" });
    }


    const skill = await Skill.create({
      name,
      description,
      level,
      user: userId
    });

    await Profile.findOneAndUpdate(
  { user: userId },              // find the profile by user ID
  { $addToSet: { teachSkills: skill._id } }, // add skill ID if not already present
  { new: true }                  // return the updated profile
);
    res.status(201).json({ message: "Skill added successfully", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills of a user
exports.getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId })
      .populate("teachSkills", "name level -_id"); 
      // <-- only fetch specific fields

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

     res.status(200).json({ teachSkills: profile.teachSkills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, level } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Only owner or admin can update
    if (skill.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this skill" });
    }

    skill.name = name || skill.name;
    skill.description = description || skill.description;
    skill.level = level || skill.level;

    await skill.save();
    res.status(200).json({ message: "Skill updated successfully", skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });


    // Only the user who created it or an admin can delete
    if (skill.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this skill" });
    }

    // Delete the skill
    await Skill.findByIdAndDelete(id);

    // Remove this skill from teachSkills
    await Profile.updateMany(
      { user: skill.user },
      { $pull: { teachSkills: id } }
    );
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};