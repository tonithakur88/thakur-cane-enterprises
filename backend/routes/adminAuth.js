<<<<<<< HEAD
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { id: "env-admin", role: "admin" },  // ⚠️ THIS IS IMPORTANT
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({ token });
});

=======
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { id: "env-admin", role: "admin" },  // ⚠️ THIS IS IMPORTANT
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({ token });
});

>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
export default router;