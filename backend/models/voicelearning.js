import mongoose from "mongoose";

const voiceLearningSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    correctedText: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
    },
    vocabulary: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VoiceLearning", voiceLearningSchema);
