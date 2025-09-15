export function validateProductFields(fields, isEdit = false) {
  const errors = [];

  // Required fields (skip if isEdit and field not present)
  const required = [
    "title",
    "brand",
    "category",
    "sku",
    "hsnCode",
    "stock",
    "gstRate",
    "price",
    "dimensions",
    "weight"
  ];
  if (!isEdit) {
    required.forEach((field) => {
      if (!fields[field]) errors.push(`${field} is required.`);
    });
    // Check dimensions subfields
    if (
      !fields.dimensions ||
      typeof fields.dimensions !== "object" ||
      fields.dimensions.length === undefined ||
      fields.dimensions.width === undefined ||
      fields.dimensions.height === undefined
    ) {
      errors.push("Dimensions (length, width, height) are required.");
    }
    // Check weight
    if (fields.weight === undefined || fields.weight === null) {
      errors.push("Weight is required.");
    }
  }

  // Validate price
  if (fields.price !== undefined) {
    if (isNaN(fields.price) || fields.price < 0) errors.push("Price must be a non-negative number.");
  }

  // Validate discount
  if (fields.discount !== undefined) {
    if (isNaN(fields.discount) || fields.discount < 0 || fields.discount > 100)
      errors.push("Discount must be between 0 and 100.");
  }

  // Validate stock
  if (fields.stock !== undefined) {
    if (isNaN(fields.stock) || fields.stock < 0) errors.push("Stock must be a non-negative number.");
  }

  // Validate GST rate
  if (fields.gstRate !== undefined) {
    const allowedGstRates = [0, 5, 12, 18, 28];
    if (!allowedGstRates.includes(Number(fields.gstRate)))
      errors.push("Invalid GST rate.");
  }

  // Validate SKU
  if (fields.sku !== undefined) {
    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    if (!skuRegex.test(fields.sku.trim()))
      errors.push("SKU must be 4-20 characters using letters, numbers, hyphens, or underscores only.");
  }

  // Validate HSN Code
  if (fields.hsnCode !== undefined) {
    if (!/^\d{4,8}$/.test(fields.hsnCode.trim()))
      errors.push("HSN Code must be 4 to 8 digits.");
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
    if (Array.isArray(fields.colors)) {
      fields.colors = fields.colors.map(c => c.trim().toLowerCase()).filter(Boolean);
    } else if (typeof fields.colors === "string") {
      fields.colors = fields.colors.split(",").map(c => c.trim().toLowerCase()).filter(Boolean);
    } else {
      errors.push("Colors must be an array or string.");
    }
  }

  // Tags
  if (fields.tags !== undefined) {
    if (Array.isArray(fields.tags)) {
      fields.tags = fields.tags.map(tag => tag.trim().toLowerCase()).filter(Boolean);
    } else if (typeof fields.tags === "string") {
      fields.tags = fields.tags.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean);
    } else {
      errors.push("Tags must be an array or string.");
    }
  }

  // Sizes
  if (fields.sizes !== undefined) {
    const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "Free Size"];
    if (Array.isArray(fields.sizes)) {
      fields.sizes = fields.sizes.map(s => s.replace(/[-_]/g, " ").trim()).filter(Boolean);
    } else if (typeof fields.sizes === "string") {
      fields.sizes = fields.sizes.split(",").map(s => s.replace(/[-_]/g, " ").trim()).filter(Boolean);
    } else {
      errors.push("Sizes must be an array or string.");
    }
    const isValidSizes = fields.sizes.every(size => allowedSizes.includes(size));
    if (!isValidSizes) errors.push("Invalid size(s) detected.");
  }

  return { isValid: errors.length === 0, errors, fields };
}