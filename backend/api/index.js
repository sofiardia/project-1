import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import authRoutes from "../routes/auth.routes.js";
import linkRoutes from "../routes/links.routes.js";
import userRoutes from "../routes/user.routes.js";
import protect from "../middleware/auth.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected) return;

  await connectDB();
  isConnected = true;
};

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Test route works 🎉" });
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized 🔥",
    user: req.user,
  });
});

export default app;