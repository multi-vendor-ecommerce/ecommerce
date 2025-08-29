import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: 100,
      unique: true,
    },
    categoryImage: {
      type: String,
      trim: true,
      default: "https://cdn1.smartprix.com/rx-igT1rzgGY-w1200-h1200/gT1rzgGY.jpg",
    },
    categoryImageId: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    level: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
