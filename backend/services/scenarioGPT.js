import OpenAI from "openai";
import { scenarioPrompts } from "./scenariopromp.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ai-language-tutor-backend-a8f7.onrender.com",
    "X-Title": "AI Scenario Chat Project",
  },
});

export const getScenarioResponse = async (scenarioId, userMessage) => {
  try {
    const basePrompt =
      scenarioPrompts[scenarioId] ||
      "You are a helpful conversational assistant.";

    const prompt = `
${basePrompt}

User message:
"${userMessage}"

Respond naturally and continue the conversation.
`;

    const response = await openai.responses.create({
      model: "google/gemma-3-4b-it:free",
      temperature: 0.7,
      max_output_tokens: 150,
      input: prompt,
    });

    return response.output?.[0]?.content?.[0]?.text?.trim() || "No response.";
  } catch (error) {
    console.error("Scenario error:", error);
    return "Scenario mode unavailable.";
  }
};