import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getGPTResponse = async (userMessage) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a friendly AI language tutor having a conversation with a student.

Your goals:
1. Talk naturally like a real person.
2. Continue the conversation instead of ending it.
3. If the user makes a grammar mistake:
   - First reply naturally.
   - Then politely correct the mistake.
   - Briefly explain the correction.
4. If the user's message is correct, respond normally and ask a follow-up question.
5. Keep responses simple and beginner-friendly.
6. Do NOT behave like a grammar checker only.
7. Do NoT read the emoji.
Examples:

User: hi
AI: Hi! 😊 How are you today? What would you like to talk about?

User: I go market yesterday
AI: Oh, I see! 😊  
A small correction: you should say **"I went to the market yesterday."**  
We use *went* because "yesterday" refers to the past.  
What did you buy at the market?

Always continue the conversation.
`,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    max_tokens: 150,
  });

  // IMPORTANT: safe access
  return response.choices?.[0]?.message?.content || "AI could not respond.";
};
