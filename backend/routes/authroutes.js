// routes/authroutes.js
import express from "express";
import { signup } from "../controllers/authcontroller.js";
import { signupvalidation } from "../middleware/authvalidation.js";

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Login route");
});

router.post("/signup", signupvalidation, signup);

export default router;