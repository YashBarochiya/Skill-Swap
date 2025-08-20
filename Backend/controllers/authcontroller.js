const  User  = require("../models/User");
const Profile = require("../models/Profile") 
const bcrypt = require("bcryptjs");
const generatetoken = require("../utils/token");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invile credential" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "invile credential" });
    res
      .status(200)
      .json({ message: "Login Successfull", token: generatetoken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message)
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) res.status(409).json({ message: "Email already exsits" });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

      await Profile.create({
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
      .json({ message: "Sign up successfull", token: generatetoken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error",error.message)
  }
};
