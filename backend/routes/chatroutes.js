import express from "express";
import { getGPTResponse } from "../services/gptservice.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
      console.log(req.body);
      
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const aiReply = await getGPTResponse(message);

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("GPT error:", error);
    res.status(500).json({ message: "AI service failed" });
  }
});

export default router;
