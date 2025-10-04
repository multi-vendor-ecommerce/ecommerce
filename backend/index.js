import dotenv from "dotenv";
dotenv.config();

import connectToMongo from "./db.js";
import express from "express";
import cors from "cors";
import apiRoutes from "./config/routes.js";

// ==========================
// Connect to Database
// ==========================
connectToMongo();

// ==========================
// Import Cron Jobs
// ==========================
import "./cron/shiprocketSync.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================
// Middlewares
// ==========================
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://multi-vendor-e-commerce.netlify.app"
  ],
  // credentials: true
}));

// ==========================
// Health Check Route
// ==========================
app.get("/", (req, res) => {
  res.send("Welcome to Multi-Vendor Project Backend Side!");
});

apiRoutes.forEach(({ path, route }) => app.use(`/api/${path}`, route));

// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {
  console.log(`Backend listening on port http://localhost:${PORT}`);
});