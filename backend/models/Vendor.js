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
  status: {
    type: String,
    enum: ["active", "suspended", "pending", "inactive"],
    default: "pending"
  },
  productQuantity: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 10 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now }
}));

export default Vendor;
