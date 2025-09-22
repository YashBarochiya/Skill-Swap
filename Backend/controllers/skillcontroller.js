const Skill = require("../models/Skill");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { createSearchIndex } = require("../models/Swap");
const Category = require("../models/Category");

exports.getSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skills = await Skill.findById(id);
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new skill
exports.addSkill = async (req, res) => {
  try {
    const { skillname, description, level } = req.body;
    const userId = req.user._id;

    const existingSkill = await Skill.findOne({
      name: skillname,
      level,
      user: userId,
    });
    if (existingSkill) {
      return res
        .status(400)
        .json({ message: "Skill with this name and level already exists" });
    }
    const category = await Category.findOne({
      skills: { $in: [new RegExp(skillname, "i")] },
    }).select("name _id");

    const skill = await Skill.create({
      name: skillname,
      description,
      level,
      user: userId,
      category: category ? category.name : "newCategory",
    });

    await Profile.findOneAndUpdate(
      { user: userId }, // find the profile by user ID
      { $addToSet: { teachSkills: skill._id } }, // add skill ID if not already present
      { new: true } // return the updated profile
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

    const profile = await Profile.findOne({ user: userId }).populate({
      path: "teachSkills",
      select: "-user",
      populate: { path: "category", select: "name" },
    });
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
    if (
      skill.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this skill" });
    }

    const category = await Category.findOne({
      skills: { $in: [new RegExp(name, "i")] },
    }).select("name _id");
    skill.name = name || skill.name;
    skill.description = description || skill.description;
    skill.level = level || skill.level;
    skill.category=category||"newCategory";
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
    if (
      skill.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this skill" });
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

exports.addlearnSkill = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { skillName } = req.body;

    if (!skillName) {
      return res.status(400).json({ message: "Skill name is required" });
    }
    // 1️⃣ Find the user profile
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 2️⃣ Prevent duplicates
    if (profile.learnSkills.includes(skillName)) {
      return res
        .status(400)
        .json({ message: "Skill already added in learnSkills" });
    }

    // 3️⃣ Add the skill
    profile.learnSkills.push(skillName);
    await profile.save();

    res.json({
      message: "Skill added to learnSkills",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletelearnSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName } = req.body;
    if (!skillName) {
      res.status(404).json({ message: "select Skill first" });
    }
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
    }
    if (!profile.learnSkills.includes(skillName)) {
      res
        .status(400)
        .json({
          message: "You can delete skill which is only present in learnskill",
        });
    }
    profile.learnSkills = profile.learnSkills.filter((s) => s !== skillName);
    profile.save();
    res
      .status(200)
      .json({ message: "Skill removed from learnSkills", profile });
  } catch (error) {
    res.status(500).json({ message: "Server Error", profile });
  }
};
