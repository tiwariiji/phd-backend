const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel/userModel");
const authValidation = require("../../validation/authValidator/authValidator");
const otpModel = require("../../models/userModel/otpModel");
const forgotValidator = require("../../validation/authValidator/forgotValidator");

// Generate 4-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

module.exports.register = async (req, res) => {
  try {
    // validation
    const { error } = authValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    let { name, email, password, confirmPassword, mobileNo } = req.body;

    email = email.trim().toLowerCase();

    //Extra safety check
    if (!name || !email || !password || !confirmPassword || !mobileNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //Block admin email
    if (email === process.env.ADMIN_EMAIL) {
      return res
        .status(400)
        .json({ message: "Admin cannot be registered here" });
    }

    //Already exists?
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const duplicateNumberCheck = await userModel.findOne({ mobileNo });

    if (duplicateNumberCheck) {
      return res
        .status(400)
        .json({ success: false, message: "Number is already registered" });
    }

    //Delete old OTP
    await otpModel.deleteMany({ email });

    //Generate OTP
    const otp = generateOTP();
    const encodedOTP = await bcrypt.hash(otp, 10);

    //Save OTP
    await otpModel.create({
      email,
      otp: encodedOTP,
    });

    console.log("OTP: ", otp); // enter service here

    return res.status(200).json({
      success: true,
      message: "OTP has been sent to your email",
    });
  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    let { email, otp, name, password, mobileNo } = req.body;

    // Normalize email
    email = email.trim().toLowerCase();

    // Field validation
    if (!email || !otp || !name || !password || !mobileNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check again for existing user
    if (await userModel.findOne({ email })) {
      return res.status(400).json({ message: "User already registered" });
    }

    const duplicateNumberCheck = await userModel.findOne({ mobileNo });

    if (duplicateNumberCheck) {
      return res
        .status(400)
        .json({ success: false, message: "Number is already registered" });
    }

    //Find email
    const otpRecord = await otpModel.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. " });
    }

    const inputOtp = String(otp).trim();

    // Match OTP
    const isMatch = await bcrypt.compare(inputOtp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Please enter the correct OTP" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      mobileNo,
    });

    //Delete all OTP entries for that email
    await otpModel.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileNo: newUser.mobileNo,
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.resendOTP = async (req, res) => {
  try {
    const { name, email, password, mobileNo } = req.body;

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // validations
    if (!name || !normalizedEmail || !password || !mobileNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password confirmation

    // Prevent admin registration
    if (normalizedEmail === process.env.ADMIN_EMAIL) {
      return res
        .status(400)
        .json({ message: "Admin cannot be registered here" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered. Please login." });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Delete any old OTP for that email
    await otpModel.deleteMany({ email: normalizedEmail });

    // Save new OTP
    await otpModel.create({
      email: normalizedEmail,
      otp: hashedOtp,
    });

    console.log("Resend OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP has been resent successfully",
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    //set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { error } = forgotValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((d) => d.message),
      });
    }

    let { email } = req.body;
    console.log(email);
    email = email.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // delete old OTP
    await otpModel.deleteMany({ email });

    // generate otp
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // save otp
    await otpModel.create({
      email,
      otp: hashedOtp,
    });

    console.log("FORGOT PASSWORD OTP for ", email, "=>", otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("FORGOT OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.verifyForgotOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }

    email = email.trim().toLowerCase();
    const otpRecord = await otpModel.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    const isMatch = await bcrypt.compare(String(otp).trim(), otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    // Delete OTP after successful verification
    await otpModel.deleteMany({ email });

    // Create a short-lived reset token (15 minutes)
    const resetToken = jwt.sign(
      { email, purpose: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Use resetToken to reset password.",
      resetToken,
    });
  } catch (err) {
    console.error("VERIFY FORGOT OTP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Verify reset token
    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired reset token" });
    }

    // Ensure token purpose
    if (!payload || payload.purpose !== "reset_password" || !payload.email) {
      return res.status(400).json({ message: "Invalid reset token payload" });
    }

    const email = String(payload.email).trim().toLowerCase();

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashed;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You may login with your new password.",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
