import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  },
],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentId: String,

    // ✅ NEW — Delivery Address (Embedded Snapshot)
    address: {
      fullName: String,
      phone: String,
      pincode: String,
      state: String,
      city: String,
      addressLine: String,
      landmark: String,
    },

    // ✅ Amazon style tracking (UNCHANGED)
    status: {
      type: String,
      enum: [
        "Placed",
        "Shipped",
        "Arrived at Hub",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
