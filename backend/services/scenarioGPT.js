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
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Scenario Chat Project",
  },
});

export const getScenarioResponse = async (scenarioId, userMessage) => {
  try {
    const systemPrompt =
      scenarioPrompts[scenarioId] ||
      "You are a helpful conversational assistant.";

    const response = await openai.chat.completions.create({
      model: "google/gemma-3-4b-it:free", // FREE model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return (
      response.choices?.[0]?.message?.content?.trim() ||
      "No response."
    );
  } catch (error) {
    console.error(
      "Scenario AI error:",
      error?.response?.data || error.message
    );

    if (error.status === 429) {
      return "AI is busy right now. Please try again shortly.";
    }

    return "Scenario mode is temporarily unavailable.";
  }
};