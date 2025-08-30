import Person from "./models/Person.js";
import bcrypt from "bcryptjs";
import "./models/Admin.js";

// ==========================
// Seed Database Utility
// ==========================
export const seedDatabase = async () => {
  try {
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
