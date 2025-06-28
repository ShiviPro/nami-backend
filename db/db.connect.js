const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initialiseDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Successfully Connected to DB.");
    })
    .catch((error) => {
      console.log("Error Connecting to DB:", error);
    });
};

module.exports = { initialiseDatabase };
