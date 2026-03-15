<<<<<<< HEAD
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pendingUserSchema = new mongoose.Schema(
  {
    name: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

// Hash password before save
pendingUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
=======
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const pendingUserSchema = new mongoose.Schema(
  {
    name: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

// Hash password before save
pendingUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
