import dotenv from "dotenv";
import connectToMongo from "./db.js";
import express from "express";
import cors from "cors";

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

app.listen(PORT, () => {
  console.log(`Backend listening on port http://localhost:${PORT}`);
});