const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const authMiddleware = require("../middlewares/authMiddleware");
const auth = require("../routes/authRoute/authRoute");
const form = require("../routes/formRoute/formRoute");
const connectDB = require("../config/connectDB.js");

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://phd-addmission-frontend.vercel.app"
];

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use("/api/auth", auth);
app.use("/api/form", authMiddleware, form);

app.get("/", (req, res) => {
  res.send("Backend Vercel Server Running ✔️");
});

module.exports = app;
