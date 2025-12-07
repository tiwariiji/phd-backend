const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is required"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match",
    },

    required: false,
    select: false,
  },

  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
    match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"],
  },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
});

// To remove confirmPassword from DB
userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
