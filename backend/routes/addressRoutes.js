<<<<<<< HEAD
import express from "express";
import Address from "../models/Address.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create Address
router.post("/", protect, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      pincode,
      state,
      city,
      house,
      landmark,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      pincode,
      state,
      city,
      house,
      landmark,
      isDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 📥 Get All Addresses (Logged In User)
router.get("/", protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✏ Update Address
router.put("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    Object.assign(address, req.body);

    const updatedAddress = await address.save();

    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ❌ Delete Address
router.delete("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await address.deleteOne();

    res.json({ message: "Address removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

=======
import express from "express";
import Address from "../models/Address.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create Address
router.post("/", protect, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      pincode,
      state,
      city,
      house,
      landmark,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      pincode,
      state,
      city,
      house,
      landmark,
      isDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 📥 Get All Addresses (Logged In User)
router.get("/", protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✏ Update Address
router.put("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    Object.assign(address, req.body);

    const updatedAddress = await address.save();

    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ❌ Delete Address
router.delete("/:id", protect, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await address.deleteOne();

    res.json({ message: "Address removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
export default router;