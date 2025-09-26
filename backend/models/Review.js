import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    targetId: {
      type: Schema.Types.ObjectId,
      required: true, // ID of product/vendor/etc.
    },
    targetType: {
      type: String,
      enum: ["Product", "Vendor"],
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "rejected", "deleted", "inactive", "suspended", "deletionRejected"],
      required: true,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);