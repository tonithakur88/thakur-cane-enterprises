// File: backend/routes/productRoutes.js

import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= ADD PRODUCT ================= */
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },     // main image
    { name: "images", maxCount: 5 },    // multiple images
  ]),
  async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const {
        name,
        status,
        price,
        stock,
        description,
        specifications,
        weight,
        height,
        width,
        depth,
      } = req.body;

      if (
        !name ||
        !req.files.image ||
        (status === "active" && (!price || !stock))
      ) {
        return res.status(400).json({
          message: "All required fields must be filled",
        });
      }

      /* ===== Upload Main Image ===== */
      const mainImageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.files.image[0].buffer);
      });

      /* ===== Upload Multiple Images ===== */
      let imageArray = [];

      if (req.files.images) {
        for (let file of req.files.images) {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "products" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
              })
              .end(file.buffer);
          });

          imageArray.push(result.secure_url);
        }
      }

      /* ===== Parse Specifications Safely ===== */
      let parsedSpecs = {};
      if (specifications) {
        try {
          parsedSpecs = JSON.parse(specifications);
        } catch (err) {
          parsedSpecs = {};
        }
      }

      const newProduct = await Product.create({
        name,
        status,
        price: status === "active" ? price : undefined,
        stock: status === "active" ? Number(stock) : 0,
        image: mainImageResult.secure_url,
        images: imageArray, // multiple images
        description,
        specifications: parsedSpecs,
        dimensions: {
          weight,
          height,
          width,
          depth,
        },
      });

      res.json(newProduct);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= GET SINGLE PRODUCT ================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= DELETE PRODUCT ================= */
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE STOCK ================= */
router.put("/update-stock/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = Number(req.body.stock);
    await product.save();

    res.json({ message: "Stock updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
