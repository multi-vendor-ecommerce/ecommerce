import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const uploadProduct = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default uploadProduct;
