import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import VoiceLearning from "../models/voicelearning.js";
import { handleVoiceLearning } from "../controllers/voicecontroller.js";

const router = express.Router();

// CREATE NEW VOICE LEARNING
router.post("/", auth, handleVoiceLearning);

// HISTORY — MUST BE FIRST
router.get("/history", auth, async (req, res) => {
  try {
    const data = await VoiceLearning.find({
      userId: new mongoose.Types.ObjectId(req.user.userId),
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// SINGLE ITEM — MUST BE AFTER
router.get("/:id", auth, async (req, res) => {
  try {
    const item = await VoiceLearning.findOne({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.user.userId),
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});
// DELETE single voice learning
router.delete("/:id", auth, async (req, res) => {
  try {
    await VoiceLearning.deleteOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
