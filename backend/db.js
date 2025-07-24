import mongoose from "mongoose";
import { seedDatabase } from "./seedData.js";

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Connected to Database successfully!");

    // await seedDatabase(); // ✅ Call the separated seed logic
  } catch (error) {
    console.error("❌ Couldn't connect to Database!", error);
    process.exit(1);
  }
};

export default connectToMongo;
