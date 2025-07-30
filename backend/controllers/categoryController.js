
import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description = "", image = "", parent = null } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();

    // Check for duplicate category with same name under same parent
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      parent: parent || null,
    });

    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category with this name already exists under the same parent",
      });
    }

    let level = 1;

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).send({
          success: false,
          message: "Invalid parent category ID",
        });
      }
      level = parentCategory.level + 1;
    }

    const category = await Category.create({
      name: trimmedName,
      description: description.trim(),
      image: image.trim(),
      parent: parent || null,
      level,
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

export const getCategories = async (req, res) => {
  // try {
  //   const buildTree = async (parent = null) => {
  //     const categories = await Category.find({ parent });
  //     const result = [];

  //     for (const cat of categories) {
  //       const children = await buildTree(cat._id);
  //       result.push({ ...cat.toObject(), children });
  //     }

  //     return result;
  //   };

  //   const tree = await buildTree();
  //   res.status(200).send({ success: true, categories: tree });
  // } catch (err) {
  //   res.status(500).send({
  //     success: false,
  //     message: "Failed to fetch category tree",
  //     error: err.message,
  //   });
  // }

  try {
    // Fetch all categories
    const allCategories = await Category.find().lean();

    // Convert flat array into nested structure
    const buildTree = (categories, parentId = null) => {
      return categories
        .filter(cat => String(cat.parent) === String(parentId))
        .map(cat => ({
          ...cat,
          subcategories: buildTree(categories, cat._id)
        }));
    };

    const nestedCategories = buildTree(allCategories);

    res.status(200).json({
      success: true,
      categories: nestedCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch nested categories",
      error: error.message
    });
  }
};
