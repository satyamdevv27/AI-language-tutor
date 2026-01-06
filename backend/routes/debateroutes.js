import express from "express";
import auth from "../middleware/auth.js";
import { handleDebate } from "../controllers/debateController.js";

const router = express.Router();

router.post("/", auth, handleDebate);

export default router;
