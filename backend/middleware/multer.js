import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Multer factory with optional fixed public_id
const upload = ({
  folder = "uploads",
  prefix = "",
  fileSize = 2 * 1024 * 1024,
  allowedFormats = ["jpeg", "jpg", "png", "webp"],
  fixedPublicId = null // NEW
} = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      let publicId = fixedPublicId;
      if (!publicId) {
        publicId = (prefix ? prefix + "-" : "") + Date.now() + "-" + file.originalname.split(".")[0];
      }
      return { folder, allowed_formats: allowedFormats, public_id: publicId };
    },
  });

  return multer({ storage, limits: { fileSize } });
};

export default upload;