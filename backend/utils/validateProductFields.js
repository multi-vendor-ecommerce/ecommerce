import { splitAndClean } from "./splitAndClean.js";

export function validateProductFields(fields, isEdit = false) {
  const errors = [];

  // Required fields (skip if isEdit and field not present)
  const required = [
    "title", "brand", "category", "sku", "hsnCode",
    "stock", "gstRate", "price", "dimensions", "weight"
  ];

  if (!isEdit) {
    required.forEach((field) => {
      if (!fields[field]) errors.push(`${field} is required.`);
    });

    // Dimensions required check
    if (
      !fields.dimensions ||
      typeof fields.dimensions !== "object" ||
      fields.dimensions.length === undefined ||
      fields.dimensions.width === undefined ||
      fields.dimensions.height === undefined
    ) {
      errors.push("Dimensions (length, width, height) are required.");
    }

    // Weight required check
    if (fields.weight === undefined || fields.weight === null) {
      errors.push("Weight is required.");
    }
  }

  // Validate price
  if (fields.price !== undefined) {
    if (isNaN(fields.price) || fields.price < 0) {
      errors.push("Price must be a non-negative number.");
    }
  }

  // Validate discount
  if (fields.discount !== undefined) {
    if (isNaN(fields.discount) || fields.discount < 0 || fields.discount > 100) {
      errors.push("Discount must be between 0 and 100.");
    }
  }

  // Validate stock
  if (fields.stock !== undefined) {
    if (isNaN(fields.stock) || fields.stock < 0) {
      errors.push("Stock must be a non-negative number.");
    }
  }

  // Validate GST
  if (fields.gstRate !== undefined) {
    const allowedGstRates = [0, 5, 12, 18, 28];
    if (!allowedGstRates.includes(Number(fields.gstRate))) {
      errors.push("Invalid GST rate.");
    }
  }

  // Validate SKU
  if (fields.sku !== undefined) {
    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    if (!skuRegex.test(fields.sku.trim())) {
      errors.push("SKU must be 4-20 characters using letters, numbers, hyphens, or underscores only.");
    }
  }

  // Validate HSN Code
  if (fields.hsnCode !== undefined) {
    if (!/^\d{4,8}$/.test(fields.hsnCode.trim())) {
      errors.push("HSN Code must be 4 to 8 digits.");
    }
  }

  // Validate dimensions
  if (fields.dimensions !== undefined) {
    const d = fields.dimensions;
    if (
      typeof d !== "object" ||
      isNaN(d.length) || d.length < 0 ||
      isNaN(d.width) || d.width < 0 ||
      isNaN(d.height) || d.height < 0
    ) {
      errors.push("Dimensions must include valid length, width, and height (all non-negative numbers).");
    }
  }

  // Validate weight
  if (fields.weight !== undefined) {
    if (isNaN(fields.weight) || fields.weight < 0) {
      errors.push("Weight must be a non-negative number.");
    }
  }

  // Colors
  if (fields.colors !== undefined) {
    fields.colors = splitAndClean(fields.colors);
  }

  // Tags
  if (fields.tags !== undefined) {
    fields.tags = splitAndClean(fields.tags);
    if (fields.tags.length > 15) {
      errors.push("You can add at most 15 tags.");
    }
  }

  // Sizes
  if (fields.sizes !== undefined) {
    const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "FREE SIZE"];

    fields.sizes = splitAndClean(fields.sizes, "upper")  // ⬅ force uppercase
      .map(s => s.replace(/[-_]/g, " ").trim());        // handle "free-size" etc.

    const isValidSizes = fields.sizes.every(size => allowedSizes.includes(size));
    if (!isValidSizes) errors.push("Invalid size(s) detected.");
  }

  return { isValid: errors.length === 0, errors, fields };
}