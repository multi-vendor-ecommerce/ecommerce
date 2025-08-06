// models/User.js
import mongoose from "mongoose";
import Person from "./Person.js";

const User = Person.discriminator("customer", new mongoose.Schema({
  totalOrders: { type: Number, default: 0 },
  totalOrderValue: { type: Number, default: 0 },
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      color: { type: String }, 
      size: { type: String }
    }
  ],
}));

export default User;