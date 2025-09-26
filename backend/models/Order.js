import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
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
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"]
        },
        originalPrice: { type: Number, required: true }, // MRP ya original price
        discountPercent: { type: Number, default: 0 }, // product discount %
        discountAmount: { type: Number, default: 0 },
        basePrice: { type: Number, required: true },   // price without GST
        gstRate: { type: Number, required: true },     // GST %
        gstAmount: { type: Number, required: true },   // GST value
        totalPrice: { type: Number, required: true },  // (basePrice + gstAmount)
        color: { type: String, default: null },
        size: { type: String, default: null },

        // Vendor reference (who is selling this product)
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "Vendor",
          required: true
        },

        //   Shiprocket fields (per item/vendor)
        shiprocketOrderId: { type: String, default: "" }, // shiproket ----
        shiprocketShipmentId: { type: String, default: "" }, 
        shiprocketAWB: { type: String, default: "" },       
        courierName: { type: String, default: "" },         
        labelUrl: { type: String, default: "" },             
      }
    ],

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: false,
    },

    user: {
      type: Schema.Types.ObjectId,
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
      default: "pending",
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

    invoiceNumber: { type: String, unique: true, sparse: true },

    userInvoiceUrl: { type: String, default: null },

    vendorInvoices: [
      {
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
        invoiceUrl: { type: String },
      },
    ],
    customNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);