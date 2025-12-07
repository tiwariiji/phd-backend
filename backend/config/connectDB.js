const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(" 💖 DB Connected");
    });
    await mongoose.connect(`${process.env.MONGO_DB_URI}`);
  } catch (err) {
    console.error(" Initial connection error:", err);
  }
};

module.exports = connectDB;
