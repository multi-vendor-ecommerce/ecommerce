import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Multer factory with optional fixed public_id
const upload = ({
  folder = "uploads",
  prefix = "",
  fileSize = 2 * 1024 * 1024,
  allowedFormats = ["jpeg", "jpg", "png", "webp"],
  fixedPublicId = null,
} = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      // Sanitize file name: remove special characters and spaces
      const sanitizedBase = file.originalname
        .split(".")[0]                  // remove extension
        .toLowerCase()                  // optional, make all lowercase
        .replace(/\s+/g, "_")           // replace spaces with underscores
        .replace(/[^a-z0-9-_]/g, "");  // remove everything except letters, numbers, dash, underscore

      let publicId = fixedPublicId;
      if (!publicId) {
        publicId = `${prefix ? prefix + "-" : ""}${Date.now()}-${sanitizedBase}`;
      }

      return { folder, allowed_formats: allowedFormats, public_id: publicId };
    },
  });

  return multer({ storage, limits: { fileSize } });
};

export default upload;