const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = require("../middlewares/authMiddleware");

const auth = require("../routes/authRoute/authRoute");
const form = require("../routes/formRoute/formRoute");

const connectDB = require("../config/connectDB.js");
const cors = require("cors");

// Connect DB (important)
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app"
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Routes
app.use("/api/auth", auth);
app.use("/api/form", authMiddleware, form);

// Default Route
app.get("/", (req, res) => {
  res.send("Backend API is Live 🚀");
});

// ❗ IMPORTANT: No app.listen

module.exports = app;
