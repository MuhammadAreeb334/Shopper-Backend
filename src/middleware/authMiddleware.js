import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    // console.log("AUTH HEADER:", req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = await User.findById(decoded.id).select("-password");
    // console.log("DB USER:", user);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Request Denied" });
  }
  next();
};
