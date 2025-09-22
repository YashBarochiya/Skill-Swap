// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewcontroller");
const authMiddleware = require("../middleware/authmiddleware");

// Add review
router.post("/add", authMiddleware.authMiddleware, reviewController.addReview);

// See another user's reviews
router.get("/:userId", reviewController.getReviewsForUser);

// See own reviews
router.get("/user/me", authMiddleware.authMiddleware, reviewController.getMyReviews);

// update the review
router.post("/update", authMiddleware.authMiddleware, reviewController.updateMyReviews);
module.exports = router;
