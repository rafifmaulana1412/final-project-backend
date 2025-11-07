const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Middleware untuk verifikasi JWT token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "kepodeh");
    req.user = decoded; // simpan data user di request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ Middleware untuk role-based access control (admin always allowed)
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // 🔑 Admin always has full access to all routes
    if (req.user.role === "admin") {
      return next();
    }

    // 🧭 Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient role permission." });
    }

    next();
  };
};

module.exports = { verifyToken, allowRoles };
