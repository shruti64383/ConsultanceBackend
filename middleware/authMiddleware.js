const jwt = require("jsonwebtoken");

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email, // include more if needed
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired. Please log in again." });
    }
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// ✅ Middleware to restrict access by role
const restrictTo = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ msg: "Access denied: insufficient permissions" });
    }
    next();
  };
};

module.exports = { verifyToken, restrictTo };
