import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.person = decoded.person;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token.", error: err.message });
  }
};

export default verifyToken;