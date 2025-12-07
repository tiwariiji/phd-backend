const mongoose = require("mongoose");

const personalDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    // PERSONAL DETAILS

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    motherName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: String, // DD/MM/YYYY
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    category: {
      type: String,
      enum: ["general", "obc", "sc", "st", "ews"],
      required: true,
    },

    nationality: {
      type: String,
      required: true,
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{12}$/, "Aadhaar must be 12 digits"],
    },

    // CONTACT DETAILS

    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },

    correspondenceAddress: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Mobile number must be valid 10 digits"],
    },

    alternateMobileNumber: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Alternate number must be valid 10 digits"],
      default: null,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    filled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("personalDetails", personalDetailsSchema);
