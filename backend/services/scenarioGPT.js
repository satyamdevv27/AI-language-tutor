// import OpenAI from "openai";
// import { scenarioPrompts } from "./scenariopromp.js";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const getScenarioResponse = async (
//   scenarioId,
//   userMessage
// ) => {
//   const systemPrompt =
//     scenarioPrompts[scenarioId] ||
//     "You are a helpful conversational assistant.";

//   const response = await openai.chat.completions.create({
//     model: "mistralai/mistral-7b-instruct",
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userMessage },
//     ],
//     max_tokens: 120,
//   });

//   return response.choices[0].message.content;
// };
import OpenAI from "openai";
import { scenarioPrompts } from "./scenariopromp.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // IMPORTANT
});

export const getScenarioResponse = async (scenarioId, userMessage) => {
  try {
    const systemPrompt =
      scenarioPrompts[scenarioId] ||
      "You are a helpful conversational assistant.";

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 120,
    });

    return response.choices?.[0]?.message?.content || "No response.";
  } catch (error) {
    console.error("Scenario AI error:", error);
    return "Scenario mode is temporarily unavailable.";
  }
};