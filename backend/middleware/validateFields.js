import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Some information you entered is invalid. Please check and try again.",
      errors: errors.array()
    });
  }
  next();
};
