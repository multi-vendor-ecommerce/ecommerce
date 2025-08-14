import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      recipientName: { type: String, trim: true, required: [true, "Recipient name is required"] },
      recipientPhone: { type: String, trim: true, required: [true, "Recipient phone is required"] },
      line1: { type: String, trim: true, required: [true, "Address line 1 is required"] },
      line2: { type: String, trim: true, default: "" },
      locality: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, required: [true, "City is required"] },
      state: { type: String, trim: true, required: [true, "State is required"] },
      country: { type: String, trim: true, default: "India" },
      pincode: { type: String, trim: true, required: [true, "Pincode is required"] },
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
        }
      }
    ],

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["COD", "Online"]
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: [true, "User is required"]
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: [true, "Vendor is required"]
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
      enum: ["processing", "shipped", "delivered", "cancelled"]
    },

    deliveredAt: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);


export default mongoose.model("Order", orderSchema);