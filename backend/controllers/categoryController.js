import Category from "../models/Category.js";
import mongoose from "mongoose";

// ==========================
// Create Category
// ==========================
export const createCategory = async (req, res) => {
  try {
    const { name, description = "", image = "", parent = null } = req.body;

    // Validate category name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name required.",
      });
    }

    const trimmedName = name.trim();

    // Validate parent ID if provided
    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent category.",
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
        message: "Category already exists under this parent.",
      });
    }

    // Determine level
    let level = 1;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found.",
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
      level
    });

    return res.status(201).json({
      success: true,
      message: "Category created.",
      category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Could not create category.",
      error: err.message,
    });
  }
};

// ==========================
// Get Categories
// ==========================
export const getCategories = async (req, res) => {
  try {
    const parentId = req.query.parentId || null;

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent category.",
      });
    }

    const filter = {};
    if (parentId) {
      filter.parent = parentId;
    } else {
      filter.parent = null;
    }

    const categories = await Category.find(filter);

    return res.status(200).json({
      success: true,
      message: "Categories fetched.",
      categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch categories.",
      error: error.message
    });
  }
};
