// models/Vendor.js
import mongoose from "mongoose";
import Person from "./Person.js";

const Vendor = Person.discriminator("vendor", new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shopLogo: {
    type: String,
    default: ""
  },
  shopLogoId: {
    type: String,
    default: ""
  },
  gstNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  },
  status: {
    type: String,
    enum: ["active", "suspended", "pending", "inactive", "rejected"],
    default: "pending"
  },
  productQuantity: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 10 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now },

  shiprocket: {
    email: { type: String, trim: true },
    password: { type: String, trim: true },
    token: { type: String, trim: true },
    tokenExpiresAt: { type: Date },
    pickupLocations: [
      {
        id: Number,
        pickup_location: String,
        address: String,
        city: String,
        state: String,
        country: String,
        pin_code: String,
        name: String,
        phone: String,
        email: String,
        is_primary_location: Boolean
      }
    ]
  }
}));

export default Vendor;
