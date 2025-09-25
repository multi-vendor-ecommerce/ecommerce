import { splitAndClean } from "./splitAndClean.js";
import { toTitleCase } from "./titleCase.js";
import sanitizeHtml from "sanitize-html";

export function validateProductFields(fields, isEdit = false) {
  const errors = [];

  // Required fields (skip if isEdit and field not present)
  const required = [
    "title", "brand", "category", "sku", "hsnCode",
    "stock", "gstRate", "price", "dimensions", "weight", "description", "tags", "images"
  ];

  if (!isEdit) {
    required.forEach((field) => {
      if (!fields[field]) errors.push(`${toTitleCase(field)}'s field is required. Enter the ${field}.`);
    });
  }

  if (fields.images) {
    if (!Array.isArray(fields.images)) {
      errors.push("Images must be provided as an array.");
    } else {
      if (fields.images.length < 3) {
        errors.push("At least 3 product images to upload.");
      }
      if (fields.images.length > 7) {
        errors.push("You can upload a maximum of 7 product images.");
      }
    }
  }

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

  // Description
  if (fields.description) {
    fields.description = sanitizeHtml(fields.description, {
      allowedTags: ["p", "h1", "h2", "h3", "ul", "ol", "li", "strong", "em", "u", "a", "br"],
      allowedAttributes: {
        a: ["href", "title", "target"],
      },
    });
  }

  // Colors
  if (fields.colors !== undefined) {
    fields.colors = splitAndClean(fields.colors);
  }

  // Tags
  if (fields.tags !== undefined) {
    fields.tags = splitAndClean(fields.tags);
    if (!fields.tags.length || fields.tags.length > 15) {
      errors.push(
        !fields.tags.length
          ? "At least one tag is required."
          : "You can add at most 15 tags."
      );
    }
  }

  // Sizes
  if (fields.sizes !== undefined) {
    const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "FREE SIZE"];

    fields.sizes = splitAndClean(fields.sizes, "upper");

    const isValidSizes = fields.sizes.every(size => allowedSizes.includes(size));
    if (!isValidSizes) errors.push("Invalid size(s) detected.");
  }

  return { isValid: errors.length === 0, errors, fields };
}