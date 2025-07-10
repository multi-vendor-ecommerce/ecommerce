import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config(); 

const categories = [
  { name: "Men's Wear" },
  { name: "Ethnic Wear" },
  { name: "Footwear" },
  { name: "Beauty" },
  { name: "Home Decor" },
  { name: "Accessories" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    await Category.insertMany(categories);
    console.log("Categories Seeded");
    process.exit();
  } catch (error) {
    console.error("Error seeding categories:", error.message);
    process.exit(1);
  }
};

seed();
