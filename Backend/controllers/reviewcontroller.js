const Review = require("../models/Review");
const Swap = require("../models/Swap");
const Profile = require("../models/Profile");

//  Add a review for a completed swap
exports.addReview = async (req, res) => {
  try {
    const { swapId, revieweeId, rating, comment } = req.body;
    
    if (req.user.id === revieweeId) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const swap = await Swap.findById(swapId);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    if (swap.status !== "completed") {
      return res.status(400).json({ message: "Swap is not completed" });
    }

    if (![swap.fromUser.toString(), swap.toUser.toString()].includes(req.user.id)) {
      return res.status(403).json({ message: "You are not part of this swap" });
    }

    if (![swap.fromUser.toString(), swap.toUser.toString()].includes(revieweeId)) {
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

//  Get all reviews (for any user)
exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name email")
      .populate("reviewee", "name email");

    res.json({
      reviews
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get logged-in user's own reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate("reviewee", "name email")
      .populate("reviewer","name email");

    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");

    res.json({
      
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update review
exports.updateMyReviews = async (req, res)=>{
  try{
    const {swapId,comment,revieweeId,rating} = req.body;

    if(revieweeId===req.user.id){
      res.status(400).json({ message: "You cannot review yourself" });
    }
    const swap = await Swap.findById(swapId);
    if(!swap){
      res.status(404).json({ message: "Swap not found" });
    }

    if(swap.status!=="completed"){
      return res.status(400).json({ message: "You can only review completed swaps" });
    }

    if(![swap.fromUser.toString(),swap.toUser.toString()].includes(req.user.id)){
      return res.status(403).json({ message: "You are not part of this swap" });
    }

    if(![swap.fromUser.toString(),swap.toUser.toString()].includes(revieweeId)){
      return res.status(403).json({ message: "Invalid reviewee for this swap" });
    }

    const exsistReview = await Review.findOne({swap:swapId,reviewer:req.user.id});
    if(!exsistReview) res.status(400).json({message:"only existing reviews can update"});

    let updatedReview =  await Review.findOne({swap:swapId});
    if(updatedReview){
      updatedReview.swap = swapId || updatedReview.swap,
      updatedReview.reviewee = revieweeId || updatedReview.reviewee,
      updatedReview.reviewer = req.user.id || updatedReview.reviewer ,
      updatedReview.rating = rating || updatedReview.rating,
      updatedReview.comment = comment || updatedReview.comment
      await updatedReview.save();
      return res.status(200).json({ message: "Review updated", updatedReview });
    }

    // Update profile ratings
    const allReviews = await Review.find({ reviewee: revieweeId });
    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await Profile.findOneAndUpdate(
      { user: revieweeId },
      { totalReviews, averageRating: avgRating }
    );
  } catch(error){
     return res.status(400).json({message: "Profile updated", updatedReview })
  } 
}
