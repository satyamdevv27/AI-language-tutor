import express from "express";
import { handleScenarioChat } from "../controllers/scenarioController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, handleScenarioChat);

export default router;
