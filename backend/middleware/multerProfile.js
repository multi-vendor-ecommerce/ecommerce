import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profiles",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
    public_id: (req, file) =>
      "profile-" + Date.now() + "-" + file.originalname.split(".")[0],
  },
});

const uploadProfile = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default uploadProfile;
