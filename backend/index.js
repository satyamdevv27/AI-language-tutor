// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authroutes.js";
import "./models/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
