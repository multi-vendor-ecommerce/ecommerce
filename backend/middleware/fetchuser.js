import jwt from "jsonwebtoken";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  try {
    const payloadData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payloadData.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false,  error: "Invalid token" });
  }
}

export default fetchuser;