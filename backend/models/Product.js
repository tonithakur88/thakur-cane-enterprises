<<<<<<< HEAD
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    price: Number,

    // ✅ OLD single image (flow safe)
    image: { type: String, required: true },

    // ✅ NEW multiple images (Flipkart style gallery)
    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "coming_soon"],
      default: "active",
    },

    stock: {
      type: Number,
      default: 0,
    },

    minQty: {
      type: Number,
      default: 1,
    },

    // ✅ NEW Product Description
    description: {
      type: String,
      default: "",
    },

    // ✅ NEW Specifications (like Flipkart table)
    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // ✅ NEW Dimensions Section
    dimensions: {
      weight: { type: String, default: "" },
      height: { type: String, default: "" },
      width: { type: String, default: "" },
      depth: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
=======
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    price: Number,

    // ✅ OLD single image (flow safe)
    image: { type: String, required: true },

    // ✅ NEW multiple images (Flipkart style gallery)
    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "coming_soon"],
      default: "active",
    },

    stock: {
      type: Number,
      default: 0,
    },

    minQty: {
      type: Number,
      default: 1,
    },

    // ✅ NEW Product Description
    description: {
      type: String,
      default: "",
    },

    // ✅ NEW Specifications (like Flipkart table)
    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    // ✅ NEW Dimensions Section
    dimensions: {
      weight: { type: String, default: "" },
      height: { type: String, default: "" },
      width: { type: String, default: "" },
      depth: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
