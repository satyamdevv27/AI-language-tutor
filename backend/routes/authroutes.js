// routes/authroutes.js
// import OpenAI from "openai";
import express from "express";
import { signup } from "../controllers/authcontroller.js";
import { login } from "../controllers/authcontroller.js";
import { signupvalidation } from "../middleware/authvalidation.js";
import { loginvalidation } from "../middleware/authvalidation.js";

const router = express.Router();

router.post("/login",  loginvalidation, login);

router.post("/signup", signupvalidation, signup);

// router.get("/api", (req, res) => {
  

// const openai = new OpenAI({
//   apiKey: process.env.Api_key,
// });

// const response = openai.responses.create({
//   model: "gpt-5-nano",
//   input: "make a short summary about diferent types of flowers",
//   store: true,
// });

// response.then((result) => console.log(result.output_text));
// });

export default router;