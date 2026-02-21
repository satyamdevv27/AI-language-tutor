import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default openai;



const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // optional but recommended
    "X-Title": "AI Language Tutor", // optional
  },
});

export default openai;