const mongoose = require("mongoose");

const phdPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    // FULL-TIME / PART-TIME selection
    programType: {
      type: [String],
      enum: ["fulltime", "parttime"],
      required: true,
    },

    faculties: [
      {
        facultyName: {
          type: String,
          required: true,
        },

        departments: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],

    filled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("phdPreferences", phdPreferencesSchema);
