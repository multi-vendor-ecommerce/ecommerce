import Product from  "./models/Products.js";
import Vendor from './models/Vendor.js'

import { productsData } from "./data/seedProducts.js";
import { vendorsData } from "./data/seedVendors.js";

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
  } catch (error) {
    console.error("❌ Error seeding the database:", error.message);
    throw error;
  }
};
