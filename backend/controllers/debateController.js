import { getDebateReply } from "../services/debateGPT.js";
import User from "../models/user.js";

export const handleDebate = async (req, res) => {
  try {
    const { topic, message } = req.body;
    const userId = req.user.userId;

    if (!topic || !message) {
      return res.status(400).json({ error: "Topic and message are required" });
    }

    // 1️⃣ If this is a new debate, increase count
    if (message === "Start the debate.") {
      await User.findByIdAndUpdate(userId, {
        $inc: { "progress.debates": 1 },
      });
    }

    // 2️⃣ Get AI reply
    const reply = await getDebateReply(topic, message);

    res.json({ reply });
  } catch (error) {
    console.error("Debate AI error:", error);
    res.status(500).json({ error: "Debate AI failed" });
  }
};
