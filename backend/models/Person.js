// models/Person.js
import mongoose from "mongoose";

const options = { discriminatorKey: "role", timestamps: true };

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  profileImage: { type: String, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: "", trim: true },
  address: { type: String, default: "", trim: true },
}, options);

export default mongoose.model("Person", PersonSchema);