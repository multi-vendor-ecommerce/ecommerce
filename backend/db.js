import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to Database successfully!");
  } catch (error) {
    console.log("Couldn't connect to Database!", error);
    process.exit(1);
  }
};

export default connectToMongo;