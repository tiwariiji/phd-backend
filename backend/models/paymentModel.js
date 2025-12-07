const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admission",
    required: true,
  },
  amount: Number,
  currency: { type: String, default: "INR" },

  referenceNo: String, // ICICI ref
  bankRef: String, // ICICI bank ref no
  txnAmount: Number,

  mode: {
    type: String,
    enum: ["Online", "Exempted"],
    default: "Online",
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
