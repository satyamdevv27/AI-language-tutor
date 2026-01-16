import express from "express";
import auth from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);

export default router;
