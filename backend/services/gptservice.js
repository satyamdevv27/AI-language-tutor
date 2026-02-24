

// import openai from "./gptclient.js";


// export const getGPTResponse = async (userMessage) => {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: `
// You are a friendly AI language tutor having a conversation with a student.

// Your goals:
// 1. Talk naturally like a real person.
// 2. Continue the conversation instead of ending it.
// 3. If the user makes a grammar mistake:
//    - First reply naturally.
//    - Then politely correct the mistake.
//    - Briefly explain the correction.
// 4. If the user's message is correct, respond normally and ask a follow-up question.
// 5. Keep responses simple and beginner-friendly.
// 6. Do NOT behave like a grammar checker only.
// 7. Do NoT read the emoji.
// Examples:

// User: hi
// AI: Hi! 😊 How are you today? What would you like to talk about?

// User: I go market yesterday
// AI: Oh, I see! 😊  
// A small correction: you should say **"I went to the market yesterday."**  
// We use *went* because "yesterday" refers to the past.  
// What did you buy at the market?

// Always continue the conversation.
// `,
//       },
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ],
//     max_tokens: 150,
//   });

//   // IMPORTANT: safe access
//   return response.choices?.[0]?.message?.content || "AI could not respond.";
// };

import openai from "./gptclient.js";

export const getGPTResponse = async (userMessage) => {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemma-3-4b-it:free", // FREE model
      temperature: 0.7,
      max_tokens: 180,
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
   - Briefly explain the correction in simple words.
4. If the user's message is correct, respond normally and ask a follow-up question.
5. Keep responses simple and beginner-friendly.
6. Do NOT behave like a grammar checker only.
7. Do NOT read emojis aloud.
8. Keep responses under 120 words.

Always continue the conversation.
`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return (
      response.choices?.[0]?.message?.content?.trim() ||
      "AI could not respond."
    );
  } catch (error) {
    console.error("OpenRouter Error:", error?.response?.data || error.message);

    if (error.status === 429) {
      return "AI is busy right now. Please try again in a moment.";
    }

    return "AI is temporarily unavailable.";
  }
};