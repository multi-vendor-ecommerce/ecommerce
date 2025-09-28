// models/Vendor.js
import mongoose from "mongoose";
import Person from "./Person.js";

const { Schema } = mongoose;

const Vendor = Person.discriminator("vendor", new Schema({
  companyName: {
    type: String,
    default: "",
    trim: true
  },
  companyNameLocked: {
    type: Boolean,
    default: false
  },
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
    pickupLocationCode: { type: String, default: "" }, // SR nickname we create/map
    warehouseId: { type: Number, default: null },      // optional
    enabled: { type: Boolean, default: true }
  }

}));

export default Vendor;
