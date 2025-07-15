import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      maxlength: 100,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    image: {
      type: String,
      default: "https://cdn1.smartprix.com/rx-igT1rzgGY-w1200-h1200/gT1rzgGY.jpg",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
