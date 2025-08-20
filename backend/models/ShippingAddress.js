// models/ShippingAddress.js
import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    recipientName: { type: String, trim: true, required: true },
    recipientPhone: { type: String, trim: true, required: true },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    country: { type: String, trim: true, default: "India" },
    pincode: { type: String, trim: true, required: true },
    geoLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShippingAddress", shippingAddressSchema);