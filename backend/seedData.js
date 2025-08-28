import Category from "./models/Category.js";
import Person from "./models/Person.js";
import bcrypt from "bcryptjs";
import "./models/Admin.js";
import { categoriesData } from "./data/seedCategories.js";

// ==========================
// Seed Database Utility
// ==========================
export const seedDatabase = async () => {
  try {
    // ==========================
    // Seed Categories (hierarchical)
    // ==========================
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const insertCategoriesRecursively = async (categories, parent = null, level = 1) => {
        for (const cat of categories) {
          const newCat = await Category.create({
            name: cat.name,
            description: cat.description || "",
            image: cat.image || "",
            parent: parent,
            level: level,
          });

          if (cat.subcategories && cat.subcategories.length > 0) {
            await insertCategoriesRecursively(cat.subcategories, newCat._id, level + 1);
          }
        }
      };

      await insertCategoriesRecursively(categoriesData);
      console.log("✅ Inserted hierarchical categories.");
    } else {
      console.log(`⏭️ Skipped category insertion — ${categoryCount} categories already exist.`);
    }

    // ==========================
    // Seed Admin User (only one)
    // ==========================
    const adminEmail = process.env.ADMIN_EMAIL || "";
    const existingAdmin = await Person.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await Person.create({
        name: "Site Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      console.log("✅ Admin user seeded successfully.");
    } else {
      console.log("⏭️ Admin already exists. Skipping admin seeding.");
    }
  } catch (error) {
    console.error("❌ Error seeding the database:", error.message);
    throw error;
  }
};
