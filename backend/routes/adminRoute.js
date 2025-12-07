const express = require("express");
const adminRouter = express.Router();

const {
  adminLogin,
  getAllAdmissions,
  updateAdmissionStatus,
  getAdminDashboard,
} = require("../controllers/adminController");

const adminMiddleware = require("../middlewares/adminMiddleware");

// ------------------------------
// PUBLIC ROUTES
// ------------------------------

// Admin Login
adminRouter.post("/login", adminLogin);

// ------------------------------
// ADMIN PROTECTED ROUTES
// ------------------------------

// Get all admissions (ONLY ADMIN)
adminRouter.get("/admissions", adminMiddleware, getAllAdmissions);

// Update admission status (ONLY ADMIN)
adminRouter.put(
  "/admission/status/:id",
  adminMiddleware,
  updateAdmissionStatus
);

// Dashboard summary (ONLY ADMIN)
adminRouter.get("/dashboard", adminMiddleware, getAdminDashboard);

module.exports = adminRouter;
