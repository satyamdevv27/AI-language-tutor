import OpenAI from "openai";

/* ================= DEBUG ENV ================= */
console.log("ENV KEY EXISTS:", !!process.env.OPENAI_API_KEY);
console.log(
  "ENV KEY PREFIX:",
  process.env.OPENAI_API_KEY
    ? process.env.OPENAI_API_KEY.substring(0, 8)
    : "undefined"
);

/* ================= OPENAI CLIENT ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ai-language-tutor-backend-a8f7.onrender.com",
    "X-Title": "AI Debate Project",
  },
});

console.log("BASE URL:", "https://openrouter.ai/api/v1");

/* ================= MAIN FUNCTION ================= */
export const getDebateReply = async (topic, userMessage) => {
  try {
    const isFirstTurn =
      !userMessage ||
      userMessage.trim() === "" ||
      userMessage.toLowerCase().includes("start");

    const prompt = `
You are a skilled human debater in a live college debate.

Rules:
- Speak naturally.
- Be persuasive but respectful.
- Keep response under 80 words.
- No bullet points.
- End with one strong follow-up question.

Debate topic: "${topic}"

${
  isFirstTurn
    ? "Clearly state your position and begin the debate."
    : `Opponent said: "${userMessage}". Give a strong counter-argument.`
}
`;

    const response = await openai.responses.create({
      model: "google/gemma-3-4b-it:free",
      temperature: 0.7,
      max_output_tokens: 200,
      input: prompt,
    });

    return (
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "No response."
    );
  } catch (error) {
    console.error("Debate error:", error);
    return "Debate mode is temporarily unavailable.";
  }
};