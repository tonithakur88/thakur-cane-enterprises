<<<<<<< HEAD
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ENV ADMIN SUPPORT
    if (decoded.id === "env-admin" && decoded.role === "admin") {
      req.user = { id: "env-admin", role: "admin" };
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
=======
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ENV ADMIN SUPPORT
    if (decoded.id === "env-admin" && decoded.role === "admin") {
      req.user = { id: "env-admin", role: "admin" };
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
};