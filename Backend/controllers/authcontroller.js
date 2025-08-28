// const { OAuth2Client } = require("google-auth-library");
const  User  = require("../models/User");
const Profile = require("../models/Profile") 
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
const generatetoken = require("../utils/token");
// require("dotenv").config();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("Login email:", req.body.email);
    console.log("Login password (raw):", req.body.password);
    console.log("Login password (type):", typeof req.body.password);

    console.log(email," ",password);
    if (!user) return res.status(400).json({ message: "email not found" });
    console.log(user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) return res.status(400).json({ message: "password no matched" });
    if(user.isBanned) return res.status(403).json({message:"this user is banned"});
    console.log(user," : login")
    res
      .status(200)
      .json({ message: "Login Successfull", token: generatetoken(user._id,user.role) });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message)
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)  return res.status(409).json({ message: "Email already exsits" });
    console.log(name," ",email," ",password);
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      isBanned:false,
    });
    const profile =  await Profile.create({
      user: user._id,      // assuming Profile has a 'user' field referencing User
      bio: "",
      location: "",
      // Add any default fields for the profile here
      teachSkills: [],
      learnSkills: [],
      experience:[],
    });
    res
      .status(200)
      .json({ message: "Sign up successfull", token: generatetoken(user._id,user.role) });
  } catch (error) {
     res.status(500).json({ message: error.message });
      console.log("error",error.message)
  }
};


// exports.googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body; // Google ID Token from frontend

//     // Verify token with Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     let user = await User.findOne({ email });

//     if (!user) {
//       // Create new user
//       user = await User.create({
//         name,
//         email,
//         password: null, // No password since Google login
//         googleId: payload.sub,
//       });

//       await Profile.create({
//         user: user._id,
//         bio: "",
//         location: "",
//         teachSkills: [],
//         learnSkills: [],
//         experience: [],
//       });
//     }

//     // If user is banned
//     if (user.isBanned) {
//       return res.status(403).json({ message: "Your account is banned" });
//     }

//     res.status(200).json({
//       message: "Google login success",
//       token: generatetoken(user._id),
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
//     user.resetPasswordOTP = otp;
//     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
//     await user.save();

//     // Send OTP via email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset OTP",
//       text: `Your OTP is ${otp}`,
//     });

//     res.json({ message: "OTP sent to email" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Reset Password
// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const user = await User.findOne({
//       email,
//       resetPasswordOTP: otp,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordOTP = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };