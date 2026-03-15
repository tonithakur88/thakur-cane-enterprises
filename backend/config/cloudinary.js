<<<<<<< HEAD
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

/* Load env FIRST */
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
=======
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

/* Load env FIRST */
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
