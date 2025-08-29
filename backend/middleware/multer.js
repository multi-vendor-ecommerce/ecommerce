import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ==========================
// Multer Upload Factory
// ==========================
const upload = ({
  folder = "uploads",
  prefix = "",
  fileSize = 2 * 1024 * 1024, // default 2MB
  allowedFormats = ["jpeg", "jpg", "png", "webp"],
} = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedFormats,
      public_id: (req, file) =>
        (prefix ? prefix + "-" : "") + Date.now() + "-" + file.originalname.split(".")[0],
    },
  });

  return multer({
    storage,
    limits: { fileSize },
  });
};

export default upload;