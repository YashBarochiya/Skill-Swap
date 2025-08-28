// routes/messageRoutes.js
const express = require("express");
const { sendMessage, getMessages, markMessagesAsRead } = require("../controllers/messagecontroller");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware.authMiddleware, sendMessage);         // POST /api/messages
router.get("/:swapId", authMiddleware.authMiddleware, getMessages);  // GET /api/messages/:swapId
router.patch("/mark-read",authMiddleware.authMiddleware,markMessagesAsRead)
module.exports = router;
