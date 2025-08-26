// middleware/uploadShopLogo.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "shopLogos", // 📂 Cloudinary folder
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    public_id: (req, file) =>
      "shopLogo-" + Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const uploadShopLogo = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default uploadShopLogo;