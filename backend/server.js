import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import cron from "node-cron";
import deleteOldUsers from "./jobs/deleteUsers.js";





dotenv.config();
connectDB();
// after connectDB()
deleteOldUsers(); // ✅ added safety

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "your-frontend-domain"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Thakur Cane Enterprises Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
// ✅ RUN DAILY (12:00 AM)
cron.schedule("0 0 * * *", () => {
  console.log("Running delete users job...");
  deleteOldUsers();
});
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
