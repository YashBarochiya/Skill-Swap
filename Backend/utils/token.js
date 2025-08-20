const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userid) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign({ id: userid }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
};

module.exports = generateToken;
