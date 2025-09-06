export function validateProductFields(fields, isEdit = false) {
  const errors = [];

  // Required fields (skip if isEdit and field not present)
  const required = ["title", "brand", "category", "sku", "hsnCode", "gstRate", "price"];
  if (!isEdit) {
    required.forEach((field) => {
      if (!fields[field]) errors.push(`${field} is required.`);
    });
  }

  if (fields.price !== undefined) {
    if (isNaN(fields.price) || fields.price < 0) errors.push("Invalid price value.");
  }

  if (fields.discount !== undefined) {
    if (isNaN(fields.discount) || fields.discount < 0 || fields.discount > 100)
      errors.push("Discount must be between 0 and 100.");
  }

  if (fields.stock !== undefined) {
    if (isNaN(fields.stock) || fields.stock < 0) errors.push("Invalid stock value.");
  }

  if (fields.gstRate !== undefined) {
    const allowedGstRates = [0, 5, 12, 18, 28];
    if (!allowedGstRates.includes(Number(fields.gstRate)))
      errors.push("Invalid GST rate.");
  }

  if (fields.sku !== undefined) {
    const skuRegex = /^[A-Za-z0-9_-]{4,20}$/;
    if (!skuRegex.test(fields.sku.trim()))
      errors.push("SKU must be 4-20 characters using letters, numbers, hyphens, or underscores only.");
  }

  if (fields.hsnCode !== undefined) {
    if (!/^\d{4,8}$/.test(fields.hsnCode.trim()))
      errors.push("HSN Code must be 4 to 8 digits.");
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
    if (!isValidSizes) errors.push("Invalid size(s) provided.");
  }

  return errors;
}