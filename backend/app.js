const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = require("./middlewares/authMiddleware");

// routes
const auth = require("./routes/authRoute/authRoute");
const form = require("./routes/formRoute/formRoute");

// const adminRouter = require("./routes/adminRoute.js");
// const paymentRouter = require("./routes/paymentRoute.js");
const connectDB = require("./config/connectDB.js");
// const rzpPaymentRouter = require("./routes/rzpPaymentRoute.js");
//const connectCloudinary = require("./config/cloudinary.js");
const cors = require("cors");

//config
connectDB();
//connectCloudinary();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:5173","https://phd-addmission-frontend-rwts.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

//endpoints
app.use("/api/auth", auth);
app.use("/api/form", authMiddleware, form);
// app.use("/api/admin", adminRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/payment", rzpPaymentRouter);
// Debug log

app.use("/", (req, res) => {
  res.send("API is Working");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} | http://localhost:${PORT}`);
});
