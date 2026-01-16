
import express from "express";
import { signup } from "../controllers/authcontroller.js";
import { login } from "../controllers/authcontroller.js";
import { signupvalidation } from "../middleware/authvalidation.js";
import { loginvalidation } from "../middleware/authvalidation.js";

const router = express.Router();

router.post("/login",  loginvalidation, login);

router.post("/signup", signupvalidation, signup);

  

        

export default router;    
