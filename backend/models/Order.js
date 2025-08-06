import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Shipping address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },

    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"]
        },
        price: {
          type: Number,
          required: [true, "Product name is required"]
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"]
        },
        image: {
          type: String,
          required: [true, "Product image is required"]
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