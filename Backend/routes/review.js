// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewcontroller");
const authMiddleware = require("../middleware/authmiddleware");

// Add review
router.post("/", authMiddleware.authMiddleware, reviewController.addReview);

// See another user's reviews
router.get("/:userId", reviewController.getReviewsForUser);

// See own reviews
router.get("/me/all", authMiddleware.authMiddleware, reviewController.getMyReviews);
module.exports = router;
