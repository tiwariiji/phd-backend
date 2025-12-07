const express = require("express");
const router = express.Router();
// middleware to verify the incoming route
const verifyIp = require("../middlewares/verifyIp");
//test IP address form we get callback
const ALLOWED_IPS = process.env.EZ_ALLOWED_IPS?.split(",") || [];

const {
  initiatePayment,
  iciciCallback,
} = require("../controllers/paymentController");

const { authMiddleware } = require("../middlewares/authMiddleware");

// student must be logged in to start payment
router.post("/initiate", authMiddleware, initiatePayment);

// callback doesn't require auth
router.post("/callback", verifyIp(ALLOWED_IPS), iciciCallback);

module.exports = router;
