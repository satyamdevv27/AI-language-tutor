import { getScenarioResponse } from "../services/scenarioGPT.js";

export const handleScenarioChat = async (req, res) => {
  try {
    const { scenarioId, message } = req.body;

    if (!scenarioId || !message) {
      return res.status(400).json({ error: "Missing data" });
    }

    const reply = await getScenarioResponse(
      scenarioId,
      message
    );

    res.json({ reply });
  } catch (err) {
    console.error("Scenario AI error:", err);
    res.status(500).json({ error: "AI failed" });
  }
};
