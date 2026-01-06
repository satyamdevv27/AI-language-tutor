import { getDebateReply } from "../services/debateGPT.js";

export const handleDebate = async (req, res) => {
  try {
    const { topic, message } = req.body;

    if (!topic || !message) {
      return res.status(400).json({ error: "Topic and message are required" });
    }

    const reply = await getDebateReply(topic, message);

    res.json({ reply });
  } catch (error) {
    console.error("Debate AI error:", error);
    res.status(500).json({ error: "Debate AI failed" });
  }
};
