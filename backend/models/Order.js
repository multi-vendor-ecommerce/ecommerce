import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      recipientName: { type: String, trim: true },
      recipientPhone: { type: String, trim: true },
      line1: { type: String, trim: true },
      line2: { type: String, trim: true, default: "" },
      locality: { type: String, trim: true, default: "" },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      pincode: { type: String, trim: true },
      geoLocation: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },

    orderItems: [
      {
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"]
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"]
        },
        color: { type: String, default: null },
        size: { type: String, default: null },
      }
    ],

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: [true, "User is required"]
    },

    paidAt: {
      type: Date,
      default: null
    },

    paymentInfo: {
      id: {
        type: String,
        default: null
      },
      status: {
        type: String,
        default: null
      }
    },

    itemPrice: {
      type: Number,
      required: [true, "Item price is required"],
    },

    tax: {
      type: Number,
      required: [true, "Tax is required"],
    },

    shippingCharges: {
      type: Number,
      required: [true, "Shipping price is required"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },

    orderStatus: {
      type: String,
      default: "processing",
      enum: ["draft", "Pending", "processing", "shipped", "delivered", "cancelled"]
    },

    deliveredAt: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);


export default mongoose.model("Order", orderSchema);