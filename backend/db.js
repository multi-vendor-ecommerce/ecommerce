import mongoose from "mongoose";
import { seedDatabase } from "./seedData.js";

// ==========================
// Connect to MongoDB Database
// ==========================
const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Connected to Database successfully!");

    // ==========================
    // Seed Database (if needed)
    // ==========================
    await seedDatabase();
  } catch (error) {
    console.error("❌ Couldn't connect to Database!", error);
    process.exit(1);
  }
};

export default connectToMongo;