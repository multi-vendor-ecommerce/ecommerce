import mongoose from "mongoose";
import Product from "./models/Products.js";
import { productsData } from "./data/seedProducts.js";

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to Database successfully!");

    const count = await Product.countDocuments();

    if (count === 0) {
      await Product.insertMany(productsData);
      console.log(`Inserted ${productsData.length} dummy products.`);
    } else {
      console.log(`Skipped insertion — ${count} products already exist.`);
    }
  } catch (error) {
    console.log("Couldn't connect to Database!", error);
    process.exit(1);
  }
};

export default connectToMongo;