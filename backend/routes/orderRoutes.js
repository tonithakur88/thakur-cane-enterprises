import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import PDFDocument from "pdfkit";
import Address from "../models/Address.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ================= CREATE ORDER =================
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});


// ================= VERIFY PAYMENT =================
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment data missing" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ STOCK CHECK
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} out of stock`,
        });
      }
    }

    // ✅ CALCULATE TOTAL
    const totalAmount = items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.qty),
      0
    );

    // ✅ CREATE SEPARATE ORDERS FOR EACH PRODUCT (SAFE PROFESSIONAL FIX)

    for (let item of items) {

  const product = await Product.findById(item.productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await Order.create({
    user: req.user.id,
    items: [
      {
        product: product._id,
        name: product.name,
        image: product.image,   // ✅ Cloudinary image yahi se aayegi
        price: product.price,
        quantity: Number(item.qty),
      },
    ],
    totalAmount: product.price * Number(item.qty),
    paymentId: razorpay_payment_id,
    status: "Placed",
    address: {
      fullName: address?.fullName,
      phone: address?.phone,
      addressLine: address?.house,
      landmark: address?.landmark || "",
      city: address?.city,
      state: address?.state,
      pincode: address?.pincode,
    },
  });

  // stock reduce yahi kar do
  product.stock -= item.qty;
  await product.save();
}

    res.json({ success: true });

  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});


// ================= USER ORDERS =================
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});


// Cancel Order
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // SAFE USER CHECK
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // BLOCK only if shipped or beyond
    if (
      order.status === "Shipped" ||
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error("Cancel Route Error:", error);
    res.status(500).json({ message: error.message });
  }
});


// Token from query support
router.use("/invoice/:id", (req, res, next) => {
  if (req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  next();
});


// Generate Invoice PDF
router.get("/invoice/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "Invoice available after delivery" });
    }

    const PDFDocument = (await import("pdfkit")).default;
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(22).text("INVOICE", { align: "center" });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Customer Info
    doc.text("Shipping Address:");

    if (order.shippingAddress) {
      doc.text(order.shippingAddress.fullName || "");
      doc.text(order.shippingAddress.address || "");
      doc.text(
        `${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} - ${order.shippingAddress.pincode || ""}`
      );
    } else {
      doc.text("Address not available");
    }
    doc.moveDown();

    // Items
    doc.text("Items:");
    doc.moveDown(0.5);

    let total = 0;

    order.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      doc.text(
        `${item.name} | Qty: ${item.quantity} | ₹ ${item.price} | Total: ₹ ${itemTotal}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Grand Total: ₹ ${total}`, { align: "right" });

    doc.end();

  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= ADMIN GET ALL =================
router.get("/", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Admin Orders Error:", error);
    res.status(500).json({ message: "Error fetching all orders" });
  }
});


// ================= UPDATE STATUS =================
router.put("/:id", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    const { status } = req.body;

    const validStatuses = [
      "Placed",
      "Shipped",
      "Arrived at Hub",
      "Out for Delivery",
      "Delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🚨 BLOCK IF CANCELLED OR DELIVERED
if (order.status === "Cancelled" || order.status === "Delivered") {
  return res.status(400).json({
    message: "Finalized order cannot be updated",
  });
}

    order.status = status;
    await order.save();

    res.json(order);

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Error updating status" });
  }
});

export default router;