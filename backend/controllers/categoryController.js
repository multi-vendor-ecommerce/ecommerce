  import Category from "../models/Category.js";

  // Create a new category
  export const createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ message: "Error creating category", error: err.message });
    }
  };

  // Get all categories
  export const getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Error fetching categories", error: err.message });
    }
  };
