import { getScenarioResponse } from "../services/scenarioGPT.js";
import User from "../models/user.js";
import ScenarioSession from "../models/scenarioSession.js"; // create this model

export const handleScenarioChat = async (req, res) => {
  try {
    const { scenarioId, message } = req.body;
    const userId = req.user.userId;

    if (!scenarioId || !message) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 1️⃣ Check if this scenario already started for this user
    let session = await ScenarioSession.findOne({
      userId,
      scenarioId,
      active: true,
    });

    // 2️⃣ If not → new scenario → increment progress
    if (!session) {
      session = await ScenarioSession.create({
        userId,
        scenarioId,
        active: true,
      });

      await User.findByIdAndUpdate(userId, {
        $inc: { "progress.scenarios": 1 },
      });
    }

    // 3️⃣ Get AI reply
    const reply = await getScenarioResponse(scenarioId, message);

    res.json({ reply });
  } catch (err) {
    console.error("Scenario AI error:", err);
    res.status(500).json({ error: "AI failed" });
  }
};
