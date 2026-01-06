import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authroutes.js";
import chatRoutes from "./routes/chatroutes.js";
import voiceRoutes from "./routes/voiceroutes.js";
import scenarioRoutes from "./routes/scenarioroutes.js";
import debateRoutes from "./routes/debateroutes.js";
import profileRoutes from "./routes/profileRoutes.js"
import "./models/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/chat", chatRoutes);
// app.use("/api", voiceRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/scenario", scenarioRoutes);


app.use("/api/debate", debateRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
