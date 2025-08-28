const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.message && err.message.includes("Only images are allowed")) {
      return res.status(400).json({
        success: false,
        message: "Only jpeg, jpg, png, or webp images are accepted.",
        error: err.message,
      });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image size exceeds the allowed limit.",
        error: err.message,
      });
    }
    return res.status(400).json({
      success: false,
      message: "File upload error.",
      error: err.message,
    });
  }
  next();
};

export default multerErrorHandler;