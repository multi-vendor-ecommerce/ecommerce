import dotenv from "dotenv";
import connectToMongo from "./db.js";
import express from "express";
import cors from "cors";

import productsRoutes from "./routes/productRoutes.js"; 
import categoryRoutes from "./routes/categoryRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to Mutli-Vendor Project Backend Side!');
});

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on port http://localhost:${PORT}`);
});