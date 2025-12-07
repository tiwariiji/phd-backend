const express = require("express");
const admissionRouter = express.Router();
const upload = require("../utils/multer.js");
const {
  createAdmission,
  updateAdmission,
  submitAdmission,
  getMyAdmission,
  getAdmissionById,
  adminGetAllAdmissions,
  adminUpdateStatus,
  deleteAdmission,
} = require("../controllers/admissionController.js");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");

// multer using memory storage
const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });

// ---------------- STUDENT ROUTES ----------------

// Create new admission (EMPTY DRAFT)
admissionRouter.post("/create", authMiddleware, createAdmission);

// Update form + upload files
admissionRouter.put(
  "/update/:id",
  authMiddleware,
  upload.any(), // << IMPORTANT
  updateAdmission
);

// Submit final admission (locks form)
admissionRouter.post("/submit/:id", authMiddleware, submitAdmission);

// Get logged-in student's admission
admissionRouter.get("/my", authMiddleware, getMyAdmission);

// Get admission by ID
admissionRouter.get("/:id", authMiddleware, getAdmissionById);

// ---------------- ADMIN ROUTES ----------------

admissionRouter.get(
  "/admin/all",
  authMiddleware,
  isAdmin,
  adminGetAllAdmissions
);

admissionRouter.put(
  "/admin/status/:id",
  authMiddleware,
  isAdmin,
  adminUpdateStatus
);

// ---------------- EXPORT ----------------
module.exports = admissionRouter;
