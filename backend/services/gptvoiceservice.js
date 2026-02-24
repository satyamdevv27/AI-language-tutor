// import openai from "./gptclient.js";

// export const rewriteSentence = async (text) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "mistralai/mistral-7b-instruct",
//       temperature: 0.7,
//       max_tokens: 200,
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a friendly English language tutor.

// Speak clearly and simply.
// Do not use asterisks, bullet points, or formatting symbols.
// Do not repeat the original sentence.
// Keep explanations short and beginner-friendly.
// `
//         },
//         {
//           role: "user",
//           content: `
// Here is the student's sentence:

// "${text}"

// Please:
// 1. Rewrite it correctly.
// 2. Improve vocabulary slightly if needed.
// 3. Explain the main correction in simple English.

// Respond clearly in this structure:

// Corrected Sentence:
// Explanation:
// Vocabulary Improvements:
// `
//         }
//       ]
//     });

//     return response.choices?.[0]?.message?.content || "AI could not rewrite.";
//   } catch (error) {
//     console.error("Rewrite error:", error);
//     return "Rewrite service is temporarily unavailable.";
//   }
// };
import openai from "./gptclient.js";

export const rewriteSentence = async (text) => {
  try {
    const response = await openai.responses.create({
      model: "google/gemma-3-4b-it:free",
      temperature: 0.6,
      max_output_tokens: 180,
      input: [
        {
          role: "system",
          content: `
You are a friendly English language tutor.

Rules:
- Speak clearly and simply.
- Do NOT use asterisks, bullet points, or markdown.
- Do NOT repeat the original incorrect sentence.
- Keep explanations short and beginner-friendly.
- Be encouraging and positive.
`
        },
        {
          role: "user",
          content: `
Here is the student's sentence:

"${text}"

Please:
1. Rewrite it correctly.
2. Improve vocabulary slightly if appropriate.
3. Explain the main correction in simple English.

Respond exactly in this format:

Corrected Sentence:
Explanation:
Vocabulary Improvements:
`
        }
      ]
    });

    const output =
      response.output?.[0]?.content?.[0]?.text?.trim();

    return output || "AI could not rewrite.";

  } catch (error) {
    console.error("Rewrite error FULL:", error);

    if (error.status === 429) {
      return "Rewrite service is busy. Please try again shortly.";
    }

    if (error.status === 401) {
      return "Invalid API configuration.";
    }

    return "Rewrite service is temporarily unavailable.";
  }
};