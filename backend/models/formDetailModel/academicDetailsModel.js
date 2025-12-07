const mongoose = require("mongoose");

const AcademicDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ---------------- CLASS 10 ----------------
    class10: {
      board: {
        type: String,
        required: [true, "Class 10 Board is required"],
        trim: true,
      },
      yearOfPassing: {
        type: Number,
        required: [true, "Class 10 Year of Passing is required"],
        min: [1950, "Year must be valid"],
      },
      percentageOrCGPA: {
        type: String,
        required: [true, "Percentage/CGPA for Class 10 is required"],
      },
    },

    // ---------------- CLASS 12 ----------------
    class12: {
      board: {
        type: String,
        required: [true, "Class 12 Board is required"],
        trim: true,
      },
      yearOfPassing: {
        type: Number,
        required: [true, "Class 12 Year of Passing is required"],
        min: [1950, "Year must be valid"],
      },
      percentageOrCGPA: {
        type: String,
        required: [true, "Percentage/CGPA for Class 12 is required"],
      },
    },

    // ---------------- BACHELOR’S DEGREE ----------------
    bachelors: {
      degreeName: {
        type: String,
        required: [true, "Bachelor's Degree Name is required (e.g B.Tech)"],
      },
      universityInstitute: {
        type: String,
        required: [true, "University/Institute for Bachelor's is required"],
      },
      yearOfPassing: {
        type: Number,
        required: [true, "Bachelor's Year of Passing is required"],
        min: 1950,
      },
      percentageOrCGPA: {
        type: String,
        required: [true, "Percentage/CGPA for Bachelor's is required"],
      },
      majorSubjects: {
        type: String,
        required: [true, "Major Subjects for Bachelor's are required"],
      },
    },

    // ---------------- MASTER’S DEGREE ----------------
    masters: {
      degreeName: { type: String },
      universityInstitute: { type: String },
      yearOfPassing: { type: Number, min: 1950 },
      percentageOrCGPA: { type: String },
      thesisTitle: { type: String },
    },

    // ---------------- M.PHIL (IF APPLICABLE) ----------------
    mphil: {
      universityInstitute: { type: String },
      yearOfPassing: { type: Number, min: 1950 },
      percentageOrCGPA: { type: String },
      thesisTitle: { type: String },
    },

    // ---------------- FILLED FLAG ----------------
    filled: {
      type: Boolean,
      default: false,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AcademicDetails", AcademicDetailsSchema);
