const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.isBanned) return res.status(403).json({ message: "Your account is banned" });

    req.user = user; // attach full user info
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRoles = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in first" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  }

  next();
};

module.exports = { authMiddleware, authorizeRoles };
