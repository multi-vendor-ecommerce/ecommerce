import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["vendor", "admin"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String], // URLs or Cloudinary paths
      required: true,
      validate: [(val) => val.length > 0, "At least one image is required"],
    },
    video: {
      type: String,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      validate: {
        validator: function (v) {
          return Number.isInteger(v);
        },
        message: "Discount percent must be an integer between 0 and 100",
      },
    },
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: [/^[A-Za-z0-9_-]{4,20}$/, "SKU must be 4-20 characters, letters, numbers, hyphens or underscores only"]
    },
    hsnCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{4,8}$/.test(v);
        },
        message: "HSN code must be 4 to 8 digits"
      }
    },
    gstRate: {
      type: Number,
      enum: [0, 5, 12, 18, 28],
      required: true,
    },
    isTaxable: {
      type: Boolean,
      default: true,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    colors: {
      type: [String],
      default: [],
      validate: [(val) => val.length > 0, "At least one color is required"],
    },
    sizes: {
      type: [String],
      default: [],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    unitsSold: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema); 