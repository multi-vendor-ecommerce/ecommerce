import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order", // optional but useful -> ensure review only after purchase
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulBy: [
      {
        type: Schema.Types.ObjectId, // track kisne helpful kiya
        ref: "Person",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ProductReview", reviewSchema);
