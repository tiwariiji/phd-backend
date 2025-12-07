const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel/userModel");
const Admission = require("../models/admissionModel");

// ===========================
// ADMIN LOGIN
// ===========================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.json({
      message: "Admin logged in",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ===========================
// GET ALL ADMISSIONS
// ===========================
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().populate(
      "userId",
      "name email contact"
    );

    res.json(admissions);
  } catch (err) {
    console.error("Get Admissions Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ===========================
// UPDATE ADMISSION STATUS
// ===========================
exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { applicationStatus } = req.body;

    const validStatuses = [
      "Draft",
      "Submitted",
      "Under Review",
      "Shortlisted",
      "Accepted",
      "Rejected",
    ];

    if (!validStatuses.includes(applicationStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Admission.findByIdAndUpdate(
      req.params.id,
      { applicationStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: `Status updated to ${applicationStatus}`,
      admission: updated,
    });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ===========================
// DASHBOARD SUMMARY
// ===========================
exports.getAdminDashboard = async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const draft = await Admission.countDocuments({
      applicationStatus: "Draft",
    });
    const submitted = await Admission.countDocuments({
      applicationStatus: "Submitted",
    });
    const underReview = await Admission.countDocuments({
      applicationStatus: "Under Review",
    });
    const shortlisted = await Admission.countDocuments({
      applicationStatus: "Shortlisted",
    });
    const accepted = await Admission.countDocuments({
      applicationStatus: "Accepted",
    });
    const rejected = await Admission.countDocuments({
      applicationStatus: "Rejected",
    });

    res.json({
      total,
      draft,
      submitted,
      underReview,
      shortlisted,
      accepted,
      rejected,
    });
  } catch (err) {
    console.error("Admin Dashboard Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
