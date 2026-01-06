import openai from "./gptclient.js";

export const rewriteSentence = async (text) => {
  const prompt = `
You are an English language tutor.

User sentence:
"${text}"

Tasks:
1. Rewrite the sentence with correct grammar
2. Improve vocabulary if needed
3. Explain the main correction simply

Return in this format:
Corrected Sentence:
Explanation:
Vocabulary Improvements:
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return response.choices?.[0]?.message?.content || "AI could not rewrite.";
};
