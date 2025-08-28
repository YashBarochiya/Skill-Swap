// controllers/searchController.js
const { default: mongoose } = require("mongoose");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

exports.searchProfiles = async (req, res) => {
  try {
       const { name, skill, location, minRating, category, sortBy } = req.query;

    let pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
    ];

    let filters = {};

    // 🔍 Name filter
    if (name) {
      filters["user.name"] = { $regex: name, $options: "i" };
    }

    // 📍 Location filter
    if (location) {
      filters["location"] = { $regex: location, $options: "i" };
    }

    // ⭐ Minimum Rating filter
    if (minRating) {
      filters["averageRating"] = { $gte: Number(minRating) };
    }

    if (category) {
      filters["category"] = { $regex: category, $options: "i" };
    }

    // 🛠️ Skill filter (check in teachSkills or learnSkills)
    let skillId = null;

    if (skill) {
      const skills = await Skill.findOne({ name: new RegExp(skill, "i") });
      if (skills) {
        skillId = skills._id;
      } else {
        return res.status(404).json({ message: "Skill not found" });
      }
    }
    if (skillId) {
      filters["$or"] = [
        { teachSkills: skillId },
        { learnSkills: { $regex: skill, $options: "i" } }
        ];
      } else {
        // Only check learnSkills as string
        filters.learnSkills = { $regex: skill, $options: "i" };
      }


    if (Object.keys(filters).length > 0) {
      pipeline.push({ $match: filters });
    }

    pipeline.push({
      $project: {
        bio: 1,
        location: 1,
        teachSkills: 1,
        learnSkills: 1,
        averageRating: 1,
        totalReviews: 1,
        "user._id": 1,
        "user.name": 1,
        "user.email": 1,
        category:1,
      }
    });

    const results = await Profile.aggregate(pipeline);


    if (sortBy === "rating") {
      results = results.sort({ averageRating: -1 });
    } else if (sortBy === "reviews") {
      results = results.sort({ totalReviews: -1 });
    }

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
