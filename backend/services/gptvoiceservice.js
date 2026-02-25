import openai from "./gptclient.js";

export const rewriteSentence = async (text) => {
  try {
    const prompt = `
You are a friendly English tutor.

Rewrite the sentence correctly.
Improve vocabulary slightly if needed.
Explain the main correction simply.
Do not use bullet points or symbols.

Sentence:
"${text}"

Respond exactly like this:

Corrected Sentence:
Explanation:
Vocabulary Improvements:
`;

    const response = await openai.responses.create({
      model: "google/gemma-3-4b-it:free",
      temperature: 0.6,
      max_output_tokens: 180,
      input: prompt,
    });

    return response.output?.[0]?.content?.[0]?.text?.trim() || "No response.";
  } catch (error) {
    console.error("Rewrite error:", error);
    return "Rewrite service unavailable.";
  }
};