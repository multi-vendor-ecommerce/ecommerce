import Category from "../models/Category.js";
import mongoose from "mongoose";

export const createCategory = async (req, res) => {
  try {
    const { name, description = "", image = "", parent = null, hsnCode, gstRate } = req.body;

    // Validate category name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();

    // Validate parent ID if provided
    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent category ID",
      });
    }

    //  Validate HSN Code with regex
    const hsnRegex = /^\d{4}(\d{2}(\d{2})?)?$/;
    if (!hsnCode || !hsnRegex.test(hsnCode)) {
      return res.status(400).json({
        success: false,
        message: "HSN Code must be 4, 6 or 8 digit numeric code",
      });
    }

    //  Validate GST Rate with allowed values
    const allowedGSTRates = [0, 5, 12, 18, 28];
    if (gstRate === undefined || gstRate === null || isNaN(gstRate) || !allowedGSTRates.includes(Number(gstRate))) {
      return res.status(400).json({
        success: false,
        message: `GST Rate must be one of: ${allowedGSTRates.join(", ")}`,
      });
    }

    // Check for duplicate name under same parent
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      parent: parent || null,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with this name already exists under the same parent",
      });
    }

    // Determine level
    let level = 1;

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
      level = parentCategory.level + 1;
    }

    // Create new category
    const category = await Category.create({
      name: trimmedName,
      description: description.trim(),
      image: image.trim(),
      parent: parent || null,
      level,
      hsnCode: hsnCode.trim(),
      gstRate: Number(gstRate),
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully!",
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: err.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const parentId = req.query.parentId || null;

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parentId",
      });
    }

    const categories = await Category.find({ parent: parentId });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully!",
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};
