const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
dbConnection = async () => {
  try {
    const db = await mongoose.connect(process.env.DB_URI).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    throw new Error("Error connecting to MongoDB", error);
  }
};

module.exports = dbConnection;
