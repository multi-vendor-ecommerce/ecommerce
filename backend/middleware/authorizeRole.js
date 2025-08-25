// middleware/authorizeRoles.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.person?.role)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }
    next();
  };
};

export default authorizeRoles;