import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Vendor from "./models/Vendor.js";
import { addVendorPickup } from "./services/shiprocket/pickup.js";

const MONGO_URI = process.env.DB_URI;

async function updateOldVendors() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const vendors = await Vendor.find({ "shiprocket.pickupLocationCode": { $in: [null, ""] } });
    console.log(`Found ${vendors.length} vendors to update`);

    for (const vendor of vendors) {
      await addVendorPickup(vendor);
    }

    console.log("All vendors processed");
    process.exit(0);
  } catch (err) {
    console.error("Error updating vendors:", err);
    process.exit(1);
  }
}

updateOldVendors();