const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("✅ MongoDB Connected");
  } catch (err) {
    logger.error("MongoDB connection failed", err);
    throw err;
  }
};

module.exports = connectDB;
