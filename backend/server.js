import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import schemeRoutes from "./routes/schemeRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/schemes", schemeRoutes);
// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "YojanaSetu API"
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server Running on http://localhost:${PORT}`);
});