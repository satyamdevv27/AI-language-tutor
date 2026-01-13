import express from "express";
import authMiddleware from "../middleware/auth.js";
import Chat from "../models/chat.js";
import ChatSession from "../models/catatsession.js";
import User from "../models/user.js"; // 👈 ADD THIS
import { getGPTResponse } from "../services/gptservice.js";

const router = express.Router();

/* ---------------- CREATE NEW SESSION ---------------- */
router.post("/session", authMiddleware, async (req, res) => {
  try {
    const session = await ChatSession.create({
      userId: req.user.userId,
      title: "New Chat",
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to create session" });
  }
});

/* ---------------- GET ALL SESSIONS ---------------- */
router.get("/sessions", authMiddleware, async (req, res) => {
  try {
    const sessions = await ChatSession.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

/* ---------------- SEND MESSAGE ---------------- */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        message: "Message and sessionId are required",
      });
    }

    // 🔍 Check if this is first user message of this session
    const firstMessage = await Chat.findOne({
      sessionId,
      role: "user",
    });

    // 🧠 If first message → rename chat + increment progress
    if (!firstMessage) {
      await ChatSession.findByIdAndUpdate(sessionId, {
        title: message.slice(0, 30),
      });

      // ✅ INCREMENT CHAT COUNT
      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { "progress.chats": 1 },
      });
    }

    // save user message
    await Chat.create({
      userId: req.user.userId,
      sessionId,
      role: "user",
      text: message,
    });

    // get AI reply
    const aiReply = await getGPTResponse(message);

    // save AI reply
    await Chat.create({
      userId: req.user.userId,
      sessionId,
      role: "ai",
      text: aiReply,
    });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "AI service failed" });
  }
});

/* ---------------- GET MESSAGES FOR A SESSION ---------------- */
router.get("/history/:sessionId", authMiddleware, async (req, res) => {
  try {
    const messages = await Chat.find({
      userId: req.user.userId,
      sessionId: req.params.sessionId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/* ---------------- DELETE SESSION ---------------- */
router.delete("/session/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Chat.deleteMany({
      sessionId,
      userId: req.user.userId,
    });

    await ChatSession.findOneAndDelete({
      _id: sessionId,
      userId: req.user.userId,
    });

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
});

/* ---------------- UPDATE SESSION TITLE ---------------- */
router.patch("/session/:sessionId/title", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const session = await ChatSession.findOneAndUpdate(
      {
        _id: req.params.sessionId,
        userId: req.user.userId,
      },
      { title },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to update title" });
  }
});

export default router;
