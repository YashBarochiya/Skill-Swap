const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(
    { id: userId, role: role },  // include role in payload
    process.env.JWT_SECRET,
    { expiresIn: "3h" }
  );
};

module.exports = generateToken;
