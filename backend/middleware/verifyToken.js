const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "sanara_jwt_secret_2026";
    const decoded = jwt.verify(token, secret);

    // 🔒 normalize user object
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};
