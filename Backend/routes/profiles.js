const express = require("express");
const router = express.Router();
const { upsertProfile, getMyProfile, getProfileByUserId, getAllprofiles } = require("../controllers/profilecontroller");
const authMiddleware = require("../middleware/authmiddleware");


router.get("/list",getAllprofiles);
// Create or Update profile
router.post("/update/:userId", authMiddleware.authMiddleware, upsertProfile);

// Get my profile
router.get("/me", authMiddleware.authMiddleware, getMyProfile);

// Get profile by userId
router.get("/:userId", getProfileByUserId);

module.exports = router;
