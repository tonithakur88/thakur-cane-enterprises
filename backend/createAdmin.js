<<<<<<< HEAD
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new User({
    name: "Admin",
    email: "admin@thakur.com",
    password: hashedPassword,
    isAdmin: true
  });

  try {
    await admin.save();
    console.log("Admin user created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admin:", err);
    mongoose.disconnect();
  }
};

createAdmin();
=======
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = new User({
    name: "Admin",
    email: "admin@thakur.com",
    password: hashedPassword,
    isAdmin: true
  });

  try {
    await admin.save();
    console.log("Admin user created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admin:", err);
    mongoose.disconnect();
  }
};

createAdmin();
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
