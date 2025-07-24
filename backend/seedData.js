import Product from  "./models/Products.js";
import Vendor from './models/Vendor.js'
import Category from "./models/Category.js";
import User from "./models/User.js";

import { productsData } from "./data/seedProducts.js";
import { categoriesData } from "./data/seedCategories.js";

export const seedDatabase = async () => {
  try {
    // Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(productsData);
      console.log(`✅ Inserted ${productsData.length} dummy products.`);
    } else {
      console.log(`⏭️ Skipped product insertion — ${productCount} products already exist.`);
    }
    
    // Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(categoriesData); 
      console.log(`✅ Inserted ${categoriesData.length} categories.`);
    } else {
      console.log(`⏭️ Skipped category insertion — ${categoryCount} categories already exist.`);
    }
  } catch (error) {
    console.error("❌ Error seeding the database:", error.message);
    throw error;
  }
};
