<<<<<<< HEAD
import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   GET USER CART
========================= */
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    return res.status(200).json(cart);  // ✅ IMPORTANT
  } catch (error) {
    console.error("Get Cart Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});
/* =========================
   ADD TO CART
========================= */
router.post("/add", protect, async (req, res) => {
  const { productId, qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
    });
  }

  const existItem = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (existItem) {
    existItem.qty += qty || 1;
  } else {
    cart.items.push({
      product: productId,
      qty: qty || 1,
    });
  }

  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  res.json(updatedCart);
});

/* =========================
   UPDATE QTY (+ / -)
========================= */
router.put("/update", protect, async (req, res) => {
  const { productId, qty } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  if (qty <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  } else {
    item.qty = qty;
  }

  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  res.json(updatedCart);
});

/* =========================
   CLEAR CART
========================= */
router.delete("/clear", protect, async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json({ message: "Cart cleared" });
});

=======
import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   GET USER CART
========================= */
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    return res.status(200).json(cart);  // ✅ IMPORTANT
  } catch (error) {
    console.error("Get Cart Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});
/* =========================
   ADD TO CART
========================= */
router.post("/add", protect, async (req, res) => {
  const { productId, qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
    });
  }

  const existItem = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (existItem) {
    existItem.qty += qty || 1;
  } else {
    cart.items.push({
      product: productId,
      qty: qty || 1,
    });
  }

  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  res.json(updatedCart);
});

/* =========================
   UPDATE QTY (+ / -)
========================= */
router.put("/update", protect, async (req, res) => {
  const { productId, qty } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  if (qty <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  } else {
    item.qty = qty;
  }

  await cart.save();
  const updatedCart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  res.json(updatedCart);
});

/* =========================
   CLEAR CART
========================= */
router.delete("/clear", protect, async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json({ message: "Cart cleared" });
});

>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
export default router;