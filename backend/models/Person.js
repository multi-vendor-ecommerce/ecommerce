// models/Person.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const options = { discriminatorKey: "role", timestamps: true };

const PersonSchema = new Schema({
  name: { type: String, required: true, trim: true },
  profileImage: { type: String, default: "" },
  profileImageId: { type: String, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: "", trim: true },
  address: {
    recipientName: { type: String, trim: true, default: "" },
    recipientPhone: { type: String, trim: true, default: "" },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    country: { type: String, trim: true, default: "India" },
    pincode: { type: String, trim: true, required: true },
    geoLocation: {
      lat: { type: Number },
      lng: { type: Number }
    }
  }
}, options);

export default mongoose.model("Person", PersonSchema);