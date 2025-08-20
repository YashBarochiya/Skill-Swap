const express = require("express");
const { authMiddleware } = require("../middleware/authmiddleware");
const {createSwapRequest,
receivedRequest,
sentRequest,
updateRequestStatus}= require("../controllers/swaprequestcontroller")


const router = express.Router();
//Create a new swap request
router.post("/request", authMiddleware, createSwapRequest);

// View requests received by current user
router.get("/received", authMiddleware, receivedRequest);

// View requests sent by current user
router.get("/sent", authMiddleware, sentRequest);

// Accept or Reject request
router.put("/:id/:status", authMiddleware, updateRequestStatus);

module.exports = router;