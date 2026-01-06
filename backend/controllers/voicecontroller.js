import VoiceLearning from "../models/voicelearning.js";
import { rewriteSentence } from "../services/gptvoiceservice.js";

export const handleVoiceLearning = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId; // from auth middleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const aiResult = await rewriteSentence(text);

    // simple parsing
    const correctedText =
      aiResult
        .split("Corrected Sentence:")[1]
        ?.split("Explanation:")[0]
        ?.trim() || "";

    const explanation =
      aiResult
        .split("Explanation:")[1]
        ?.split("Vocabulary Improvements:")[0]
        ?.trim() || "";

    const vocabulary =
      aiResult.split("Vocabulary Improvements:")[1]?.trim() || "";

    const learning = await VoiceLearning.create({
      userId,
      originalText: text,
      correctedText,
      explanation,
      vocabulary,
      title: text.slice(0, 30),
    });

    res.json(learning);
  } catch (err) {
    console.error("Voice learning error:", err);
    res.status(500).json({ error: "Voice learning failed" });
  }
};
