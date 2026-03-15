<<<<<<< HEAD
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";

const router = express.Router();

/* ================= CREATE RAZORPAY ORDER ================= */
router.post("/razorpay", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      orderId: order.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Razorpay init failed" });
  }
});

/* ================= VERIFY PAYMENT & CREATE ORDER ================= */
router.post(
  "/verify-payment",
  protect,
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items,
        totalAmount,
        addressId,
      } = req.body;

      // 🔐 VERIFY SIGNATURE
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      // ✅ Get Selected Address
      const selectedAddress = await Address.findById(addressId);

      if (!selectedAddress) {
        return res.status(400).json({ message: "Address not found" });
      }

      // ✅ CREATE ORDER IN DB
      const order = await Order.create({
        user: req.user.id,
        items,
        totalAmount,
        paymentId: razorpay_payment_id,
        address: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          pincode: selectedAddress.pincode,
          state: selectedAddress.state,
          city: selectedAddress.city,
          addressLine: selectedAddress.addressLine,
          landmark: selectedAddress.landmark,
        },
      });

      res.json({
        message: "Payment successful & Order placed",
        order,
      });

    } catch (error) {
      console.error("VERIFY PAYMENT ERROR 👉", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

export default router;
=======
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";

const router = express.Router();

/* ================= CREATE RAZORPAY ORDER ================= */
router.post("/razorpay", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      orderId: order.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Razorpay init failed" });
  }
});

/* ================= VERIFY PAYMENT & CREATE ORDER ================= */
router.post(
  "/verify-payment",
  protect,
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items,
        totalAmount,
        addressId,
      } = req.body;

      // 🔐 VERIFY SIGNATURE
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      // ✅ Get Selected Address
      const selectedAddress = await Address.findById(addressId);

      if (!selectedAddress) {
        return res.status(400).json({ message: "Address not found" });
      }

      // ✅ CREATE ORDER IN DB
      const order = await Order.create({
        user: req.user.id,
        items,
        totalAmount,
        paymentId: razorpay_payment_id,
        address: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          pincode: selectedAddress.pincode,
          state: selectedAddress.state,
          city: selectedAddress.city,
          addressLine: selectedAddress.addressLine,
          landmark: selectedAddress.landmark,
        },
      });

      res.json({
        message: "Payment successful & Order placed",
        order,
      });

    } catch (error) {
      console.error("VERIFY PAYMENT ERROR 👉", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

export default router;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
