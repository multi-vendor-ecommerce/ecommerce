import Product from  "./models/Products.js";
import Vendor from './models/Vendor.js'
import Category from "./models/Category.js";
import User from "./models/User.js";

import { productsData } from "./data/seedProducts.js";
import { vendorsData } from "./data/seedVendors.js";
import { categoriesData } from "./data/seedCategories.js";
import { usersData } from "./data/seedUsers.js";

export const seedDatabase = async () => {
  try {
    // Seed Vendors
    const vendorCount = await Vendor.countDocuments();
    if (vendorCount === 0) {
      await Vendor.insertMany(vendorsData);
      console.log(`✅ Inserted ${vendorsData.length} dummy vendors.`);
    } else {
      console.log(`⏭️ Skipped vendor insertion — ${vendorCount} vendors already exist.`);
    }

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

    // Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(usersData); 
      console.log(`✅ Inserted ${usersData.length} users.`);
    } else {
      console.log(`⏭️ Skipped user insertion — ${userCount} users already exist.`);
    }
  } catch (error) {
    console.error("❌ Error seeding the database:", error.message);
    throw error;
  }
};
