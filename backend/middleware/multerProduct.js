import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1000, height: 1000, crop: "limit" }, // keeps aspect ratio, up to 1000px
      { quality: "auto" }, // balance performance + quality
      { fetch_format: "auto" }
    ],
    secure: true,
  },
});

const uploadProduct = multer({ storage: productStorage });

export default uploadProduct;