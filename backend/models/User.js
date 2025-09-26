// models/User.js
import mongoose from "mongoose";
import Person from "./Person.js";

const { Schema } = mongoose;

const User = Person.discriminator("customer", new Schema({
  totalOrders: { type: Number, default: 0 },
  totalOrderValue: { type: Number, default: 0 },
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      color: { type: String }, 
      size: { type: String }
    }
  ],
}));

export default User;