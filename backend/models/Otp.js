// models/Otp.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // auto-delete after 5 min
});

export default mongoose.model("Otp", otpSchema);