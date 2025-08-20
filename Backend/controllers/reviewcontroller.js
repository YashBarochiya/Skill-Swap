const Review = require("../models/Review");
const Swap = require("../models/Swap");
const Profile = require("../models/Profile");

// ➤ Add a review for a completed swap
exports.addReview = async (req, res) => {
  try {
    const { swapId, revieweeId, rating, comment } = req.body;

    if (req.user.id === revieweeId) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const swap = await Swap.findById(swapId);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    if (swap.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed swaps" });
    }

    if (![swap.user1.toString(), swap.user2.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: "You are not part of this swap" });
    }

    if (![swap.user1.toString(), swap.user2.toString()].includes(revieweeId)) {
      return res.status(400).json({ message: "Invalid reviewee for this swap" });
    }

    const existingReview = await Review.findOne({ swap: swapId, reviewer: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this swap" });
    }

    const review = await Review.create({
      swap: swapId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment,
    });

    // Update profile ratings
    const allReviews = await Review.find({ reviewee: revieweeId });
    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await Profile.findOneAndUpdate(
      { user: revieweeId },
      { totalReviews, averageRating: avgRating }
    );

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Get all reviews (for any user)
exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name email")
      .populate("swap", "title status");

    const profile = await Profile.findOne({ user: req.params.userId }).populate("user", "name email");

    res.json({
      user: profile.user,
      averageRating: profile.averageRating,
      totalReviews: profile.totalReviews,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ Get logged-in user's own reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.user.id })
      .populate("reviewer", "name email")
      .populate("swap", "title status");

    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");

    res.json({
      user: profile.user,
      averageRating: profile.averageRating,
      totalReviews: profile.totalReviews,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
