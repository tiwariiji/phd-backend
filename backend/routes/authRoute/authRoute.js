const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
} = require("../../controllers/authController/authController");
// Routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);

router.post("/reset-password", resetPassword);

module.exports = router;
