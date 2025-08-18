import dotenv from "dotenv";
dotenv.config();

import connectToMongo from "./db.js";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import personRoutes from "./routes/personRoutes.js";
import productsRoutes from "./routes/productRoutes.js"; 
import categoryRoutes from "./routes/categoryRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import CouponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://multi-vendor-e-commerce.netlify.app'
  ],
  // credentials: true
}));

app.get('/', (req, res) => {
  res.send('Welcome to Mutli-Vendor Project Backend Side!');
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/person", personRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/users', userRoutes);
app.use("/api/coupons", CouponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on port http://localhost:${PORT}`);
});