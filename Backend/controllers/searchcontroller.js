// controllers/searchController.js
const Profile = require("../models/Profile");

exports.searchProfiles = async (req, res) => {
  try {
    const { skill, location, minRating, sortBy } = req.query;

    let query = {};

    if (skill) {
      query.teachSkills = skill; // user wants someone who teaches this skill
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    let profiles = Profile.find(query).populate("user", "name email");

    if (sortBy === "rating") {
      profiles = profiles.sort({ averageRating: -1 });
    } else if (sortBy === "reviews") {
      profiles = profiles.sort({ totalReviews: -1 });
    }

    res.json(await profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
