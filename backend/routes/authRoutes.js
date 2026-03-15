import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";
import PendingUser from "../models/PendingUser.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, phone, password } = req.body;

    // ✅ Required fields (lastName optional)
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ 10 digit mobile validation
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await sendEmail(
      email,
      "Signup OTP Verification - Thakur Cane Enterprises",
      `
  <div style="font-family: Arial; padding:20px;">
    <h2 style="color:#2e7d32;">Welcome to Thakur Cane Enterprises 🌾</h2>

    <p>Thank you for signing up.</p>

    <h1 style="letter-spacing:4px; color:#000;">${otp}</h1>

    <p><b>This OTP is valid for 10 minutes only.</b></p>

    <hr/>

    <p style="color:#555;">
      🔒 Do not share this OTP with anyone.<br/>
      🔒 Our team will never ask for your OTP.<br/>
      🔒 If you did not request this signup, please ignore this email.
    </p>

    <br/>
    <p style="font-size:12px; color:gray;">
      © ${new Date().getFullYear()} Thakur Cane Enterprises. All rights reserved.
    </p>
  </div>
  `
    );

    await PendingUser.findOneAndUpdate(
      { email },
      { name, lastName, phone, password, otp, otpExpiry },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= VERIFY REGISTER OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (pendingUser.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (pendingUser.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    // ✅ Create real user
    const newUser = await User.create({
      name: pendingUser.name,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      phone: pendingUser.phone,
      password: pendingUser.password,
    });

    // ✅ Remove pending user
    await PendingUser.deleteOne({ email });

    res.json({
      message: "Signup successful",
    });

  } catch (error) {
    console.error("VERIFY REGISTER OTP ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


/* ================= LOGIN STEP 1 (SEND OTP) ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔥 GENERATE OTP
    const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();

    user.loginOtp = loginOtp;
    user.loginOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();  // 🚨 VERY IMPORTANT

    // console.log("Generated OTP:", loginOtp);

    await sendEmail(
  email,
  "Login OTP - Thakur Cane Enterprises",
  `
  <div style="font-family: Arial; padding:20px;">
    <h2 style="color:#111;">Login Verification Required 🔐</h2>

    <p>We received a login request for your account.</p>

    <h1 style="letter-spacing:4px; color:#000;">${loginOtp}</h1>

    <p><b>This OTP will expire in 10 minutes.</b></p>

    <hr/>

    <p style="color:#555;">
      ⚠ Never share this OTP with anyone.<br/>
      ⚠ If you did not request this login, please secure your account immediately.<br/>
      ⚠ Contact support if you notice suspicious activity.
    </p>

    <br/>
    <p style="font-size:12px; color:gray;">
      © ${new Date().getFullYear()} Thakur Cane Enterprises.
    </p>
  </div>
  `
);

    res.json({ message: "Email sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= VERIFY LOGIN OTP ================= */
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.loginOtp || user.loginOtp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.loginOtpExpiry || user.loginOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    // ✅ Clear OTP
    user.loginOtp = null;
    user.loginOtpExpiry = null;
    await user.save();

    // ✅ GENERATE TOKEN (THIS WAS MISSING)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("VERIFY LOGIN OTP ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= ADD ADDRESS ================= */
router.post("/add-address", protect, async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user.id,
    });

    res.json({ message: "Address added", address });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= GET ADDRESSES ================= */
router.get("/my-addresses", protect, async (req, res) => {
  const addresses = await Address.find({ user: req.user.id });
  res.json(addresses);
});


/* ================= GET USER PROFILE ================= */
router.get("/profile", protect, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { name, lastName, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});


/* ================= CHANGE PASSWORD ================= */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});


/* ================= DELETE ADDRESS ================= */
router.delete("/delete-address/:id", protect, async (req, res) => {
  try {
    await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Address deleted" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= FORGOT PASSWORD ================= */

router.post("/forgot-password", async (req,res)=>{

  try{

    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message:"User not found"});
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10*60*1000;

    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `<h2>Your OTP: ${otp}</h2>`
    );

    res.json({message:"OTP sent"});

  }catch{

    res.status(500).json({message:"Server error"});

  }

});


router.post("/reset-password", async (req,res)=>{

  try{

    const {email,otp,newPassword} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message:"User not found"});
    }

    if(user.resetOtp !== otp){
      return res.status(400).json({message:"Invalid OTP"});
    }

    if(user.resetOtpExpiry < Date.now()){
      return res.status(400).json({message:"OTP expired"});
    }

    const hashed = await bcrypt.hash(newPassword,10);

    user.password = hashed;

    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.json({message:"Password reset successful"});

  }catch{

    res.status(500).json({message:"Server error"});

  }

});

export default router;
