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
        originalPrice: { type: Number, required: true }, 
        discountPercent: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        basePrice: { type: Number, required: true },
        gstRate: { type: Number, required: true },    
        gstAmount: { type: Number, required: true },   
        totalPrice: { type: Number, required: true }, 
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

    subTotal: { type: Number, required: true },        
    totalTax: { type: Number, required: true },        
    shippingCharges: { type: Number, required: true }, 
    totalDiscount: { type: Number, default: 0 },           
    grandTotal: { type: Number, required: true },    

    orderStatus: {
      type: String,
      default: "processing",
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
    },

    source: {
      type: String,
      enum: ["cart", "buyNow"],
      required: true,
    },

    deliveredAt: {
      type: Date,
      default: null
    },

    // invoiceNumber: {
    //   type: String,
    //   required: false, // or true if you always generate it
    //   unique: true,    // optional, if you want uniqueness
    // },
    invoiceNumber: { type: String, unique: true, sparse: true},

    userInvoiceUrl: { type: String, default: null }, // URL for customer invoice
    vendorInvoices: [
      {
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
        invoiceUrl: { type: String },
      },
    ],
    customNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);