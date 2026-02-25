import openai from "./gptclient.js";

export const getGPTResponse = async (userMessage) => {
  try {
    const prompt = `
You are a friendly English language tutor.

Talk naturally.
If there is a grammar mistake:
- Reply normally first.
- Then correct it politely.
- Explain briefly in simple English.
Always continue the conversation.
Keep under 120 words.

Student message:
"${userMessage}"
`;

    const response = await openai.responses.create({
      model: "google/gemma-3-4b-it:free",
      temperature: 0.7,
      max_output_tokens: 180,
      input: prompt,
    });

    return response.output?.[0]?.content?.[0]?.text?.trim() || "No response.";
  } catch (error) {
    console.error("Tutor error:", error);
    return "AI is temporarily unavailable.";
  }
};