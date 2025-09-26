import mongoose from "mongoose";

const { Schema } = mongoose;

const wishlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Wishlist", wishlistSchema);
