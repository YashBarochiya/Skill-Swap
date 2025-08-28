const express = require("express");

const router = express.Router();
const {signup, login,googleAuth,forgotPassword,resetPassword} = require("../controllers/authcontroller");

router.post("/signup",signup);
router.post("/login",login);
// router.post("/google", googleAuth);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;