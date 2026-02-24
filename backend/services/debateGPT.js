// // import OpenAI from "openai";

// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // export const getDebateReply = async (topic, userMessage) => {
// //   const response = await openai.chat.completions.create({
// //     model: "mistralai/mistral-7b-instruct",
// //     messages: [
// //       {
// //         role: "system",
// //         content: `
// // You are a debate opponent.

// // Rules:
// // - Keep each response under 70 words
// // - Make 1–2 clear arguments only
// // - Ask ONE follow-up question
// // - Speak like a confident human debater, not an essay writer
// // - Do not summarize unless debate ends
// // `,
// //       },
// //       {
// //         role: "user",
// //         content: `
// // Debate topic:
// // "${topic}"

// // User argument:
// // "${userMessage}"
// // `,
// //       },
// //     ],
// //     max_tokens: 180,
// //   });

// //   return response.choices[0].message.content;
// // };
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // keep same name
//   baseURL: "https://openrouter.ai/api/v1", // IMPORTANT
// });

// export const getDebateReply = async (topic, userMessage) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "mistralai/mistral-7b-instruct",
//       messages: [
//         {
//           role: "system",
//           content:  `
// You are a confident human debater in a live debate.

// Speak naturally.
// Be persuasive but respectful.
// Keep replies under 80 words.
// Make 1–2 strong arguments only.
// Avoid bullet points or symbols.
// End with one challenging follow-up question.

// If you are starting the debate, clearly state your position first.
// `
//         },
//         {
//           role: "user",
//           content: isFirstTurn
//             ? `The debate topic is: "${topic}". Please begin the debate and state your position.`
//             : `
// Debate topic: "${topic}"

// Opponent argument: "${userMessage}"

// Respond naturally.
// `,
//         },
//       ],
//       temperature: 0.8,
//       max_tokens: 180,
//     });

//     return response.choices?.[0]?.message?.content || "No response.";
//   } catch (error) {
//     console.error("Debate AI error:", error);
//     return "Debate mode is temporarily unavailable.";
//   }
// };

// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // using OpenRouter key here
//   baseURL: "https://openrouter.ai/api/v1",
// });

// export const getDebateReply = async (topic, userMessage) => {
//   try {
//     const isFirstTurn =
//       !userMessage ||
//       userMessage.toLowerCase().includes("start the debate");

//     const response = await openai.chat.completions.create({
//       model: "google/gemma-3-4b-it",
//       temperature: 0.8,
//       max_tokens: 300,
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a confident human debater in a live debate.

// Speak naturally like a real person.
// Be persuasive but respectful.
// Keep replies under 80 words.
// Make 1–2 strong arguments only.
// Avoid bullet points or formatting symbols.
// End with one sharp follow-up question.
// `,
//         },
//         {
//           role: "user",
//           content: isFirstTurn
//             ? `The debate topic is: "${topic}". Start the debate by clearly stating your position.`
//             : `Debate topic: "${topic}"

// Opponent argument: "${userMessage}"

// Respond naturally with a counter-argument.`,
//         },
//       ],
//     });

//     return response.choices?.[0]?.message?.content || "No response.";
//   } catch (error) {
//     console.error("Debate AI error:", error);
//     return "Debate mode is temporarily unavailable.";
//   }
// };

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ai-language-tutor-backend-a8f7.onrender.com",
    "X-Title": "AI Debate Project",
  },
});

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

    return response.output?.[0]?.content?.[0]?.text?.trim() || "No response.";
  } catch (error) {
    console.error("Debate error:", error);
    return "Debate mode is temporarily unavailable.";
  }
};
