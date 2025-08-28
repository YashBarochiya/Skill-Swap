// routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchcontroller");
const matchController = require("../controllers/matchcontroller");
const authMiddleware = require("../middleware/authmiddleware");

router.get("/", searchController.searchProfiles);
router.get("/matches", authMiddleware.authMiddleware, matchController.matchUsers);

module.exports = router;
