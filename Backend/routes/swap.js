const express = require("express");
const { getMySwaps, confirmAgreement, cancelSwap, completeSwap } =
  require("../controllers/swapcontroller");
const { authMiddleware } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/my", authMiddleware, getMySwaps);
router.put("/:id/confirm", authMiddleware, confirmAgreement);
router.put("/:id/cancel", authMiddleware, cancelSwap);
router.put("/:id/complete", authMiddleware, completeSwap);

module.exports = router;
