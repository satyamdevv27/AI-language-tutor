// index.js
import express from "express";
 import cors from "cors";
import dotenv from "dotenv";
 dotenv.config();

 import authRoutes from "./routes/authroutes.js";
 import chatRoutes from "./routes/chatroutes.js";
 import "./models/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(cors());

 app.use("/auth", authRoutes);


app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
