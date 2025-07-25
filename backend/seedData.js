import Product from "./models/Products.js";
import Category from "./models/Category.js";
import Person from "./models/Person.js";
import Order from "./models/Order.js";
import bcrypt from "bcryptjs";
import "./models/Admin.js";

import { productsData } from "./data/seedProducts.js";
import { categoriesData } from "./data/seedCategories.js";
import { orderSeedData } from "./data/seedOrder.js";

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

    // Seed Admin (only one)
    const adminEmail = process.env.ADMIN_EMAIL || "";
    const existingAdmin = await Person.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await Person.create({ name: "Site Admin", email: adminEmail, password: hashedPassword, role: "admin" });
      console.log("✅ Admin user seeded successfully.");
    } else {
      console.log("⏭️ Admin user already exists. Skipping admin seeding.");
    }
  } catch (error) {
    console.error("❌ Error seeding the database:", error.message);
    throw error;
  }

  // Seed Orders
  const orderCount = await Order.countDocuments();
  if (orderCount === 0) {
    await Order.insertMany(orderSeedData);
    console.log(`✅ Inserted ${orderSeedData.length} orders.`);
  } else {
    console.log(`⏭️ Skipped order insertion — ${orderCount} orders already exist.`);
  }

};
