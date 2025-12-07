const mongoose = require("mongoose");

const EntranceExamSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ---------- UGC-NET ----------
    ugcNet: {
      qualified: { type: String, enum: ["yes", "no"], required: true },
      subject: { type: String },
      year: { type: Number },
      jrf: { type: String, enum: ["yes", "no"] },
    },

    // ---------- GATE ----------
    gate: {
      qualified: { type: String, enum: ["yes", "no"], required: true },
      discipline: { type: String },
      score: { type: String },
      year: { type: Number },
    },

    // ---------- University PhD Entrance ----------
    universityPhd: {
      appeared: { type: String, enum: ["yes", "no"], required: true },
      year: { type: Number },
      scoreOrRank: { type: String },
    },

    // ---------- Other Exam ----------
    other: {
      examName: { type: String },
      year: { type: Number },
      score: { type: String },
    },

    // ---------- FILLED FLAG ----------
    filled: {
      type: Boolean,
      default: false, // Initially false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EntranceExamDetails", EntranceExamSchema);
