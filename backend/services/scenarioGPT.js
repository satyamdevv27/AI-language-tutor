import OpenAI from "openai";
import { scenarioPrompts } from "./scenariopromp.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getScenarioResponse = async (
  scenarioId,
  userMessage
) => {
  const systemPrompt =
    scenarioPrompts[scenarioId] ||
    "You are a helpful conversational assistant.";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 120,
  });

  return response.choices[0].message.content;
};
