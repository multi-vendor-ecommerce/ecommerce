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
import paymentRoutes from "./routes/paymentRoutes.js";
import shippingAddressRoutes from "./routes/shippingAddressRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

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
const apiRoutes = [
  { path: "auth", route: authRoutes },
  { path: "person", route: personRoutes },
  { path: "products", route: productsRoutes },
  { path: "categories", route: categoryRoutes },
  { path: "vendors", route: vendorRoutes },
  { path: "users", route: userRoutes },
  { path: "coupons", route: CouponRoutes },
  { path: "cart", route: cartRoutes },
  { path: "orders", route: orderRoutes },
  { path: "payment", route: paymentRoutes },
  { path: "shipping-address", route: shippingAddressRoutes },
  { path: "images", route: imageRoutes }
];

apiRoutes.map(({ path, route }) => app.use(`/api/${path}`, route));

app.listen(PORT, () => {
  console.log(`Backend listening on port http://localhost:${PORT}`);
});