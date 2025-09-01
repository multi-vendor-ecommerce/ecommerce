import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Use the first error's message for more detail
    return res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg || "Some information you entered is invalid. Please check and try again.",
      errors: errors.array()
    });
  }
  next();
};