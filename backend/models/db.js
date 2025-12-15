const mongoose = require("mongoose");
require("dotenv").config();

const mongo_url = process.env.mongo_conn;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
