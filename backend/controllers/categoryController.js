import Category from "../models/Category.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description = "", image = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();

    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category already exists",
      });
    }

    // Create category with name and description
    const category = await Category.create({
      name: trimmedName,
      description: trimmedDescription,
    });

    res.status(201).send({ success: true, category });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error creating category",
      error: err.message,
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.send({ success: true, categories });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error fetching categories",
      error: err.message,
    });
  }
};
