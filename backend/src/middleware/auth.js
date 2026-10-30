const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "acadexa_jwt_secret_token_key_2026_secure");
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found or token invalid" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
    }
    next();
  };
};

module.exports = { auth, requireRole };
