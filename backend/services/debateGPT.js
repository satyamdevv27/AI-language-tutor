import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getDebateReply = async (topic, userMessage) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a debate opponent.

Rules:
- Keep each response under 70 words
- Make 1–2 clear arguments only
- Ask ONE follow-up question
- Speak like a confident human debater, not an essay writer
- Do not summarize unless debate ends
`,
      },
      {
        role: "user",
        content: `
Debate topic:
"${topic}"

User argument:
"${userMessage}"
`,
      },
    ],
    max_tokens: 180,
  });

  return response.choices[0].message.content;
};
