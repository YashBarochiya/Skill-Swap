const express = require("express");
const { getMySwaps, confirmAgreement, cancelSwap, completeSwap } =
  require("../controllers/swapcontroller");
const { authMiddleware } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/my", authMiddleware, getMySwaps);
router.post("/:id/confirm", authMiddleware, confirmAgreement);
router.post("/:id/cancel", authMiddleware, cancelSwap);
router.post("/:id/complete", authMiddleware, completeSwap);

module.exports = router;
