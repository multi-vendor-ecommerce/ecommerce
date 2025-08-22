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
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "https://cdn1.smartprix.com/rx-igT1rzgGY-w1200-h1200/gT1rzgGY.jpg",
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

    hsnCode: {
      type: String,
      required: true,
      trim: true
    },
    
    gstRate: {
      type: Number,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
