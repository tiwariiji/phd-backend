const jwt = require("jsonwebtoken");
const User = require("../models/userModel/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token)
      return res.status(401).json({ message: "No token, admin unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "admin")
      return res.status(403).json({ message: "Admin only access" });

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
