import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getGPTResponse } from "../services/gptservice.js";

const router = express.Router();

router.post("/voice", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const aiReply = await getGPTResponse(message);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Voice AI error:", error);
    res.status(500).json({ message: "Voice AI failed" });
  }
});

export default router;
