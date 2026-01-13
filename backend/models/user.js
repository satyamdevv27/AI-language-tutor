import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,

    avatar: {
      type: String,
      default: "./public/avatar.jpg",
    },

    bio: {
      type: String,
      default: "",
    },

    progress: {
      chats: { type: Number, default: 0 },
      debates: { type: Number, default: 0 },
      scenarios: { type: Number, default: 0 },
    },
    rank: {
      type: String,
      default: "Beginner",
    },
    learningScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
