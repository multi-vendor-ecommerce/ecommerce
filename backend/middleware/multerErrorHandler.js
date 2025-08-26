// middleware/multerErrorHandler.js

import e from "express";

const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    // Multer-specific custom errors
    if (err.message && err.message.includes("Only images are allowed")) {
      return res.status(400).json({
        success: false,
        message: "Images must be of type jpeg, jpg, png, or webp.",
        error: err.message,
      });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "Image size exceeded", error: err.message });
    }

    // Any other unexpected error
    return res.status(400).json({ status: false, message: "Error", error: err.message });
  }

  // No error → continue
  next();
}

export default multerErrorHandler;
