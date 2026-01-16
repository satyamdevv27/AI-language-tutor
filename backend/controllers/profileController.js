import User from "../models/user.js";
import { calculateLearningScore, getRank } from "../utils/progressUtils.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const score = calculateLearningScore(user.progress);
    const rank = getRank(score);

    user.learningScore = score;
    user.rank = rank;
    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      rank,
      learningScore: score,
      progress: user.progress,
      chartData: [
        { name: "Chats", value: user.progress.chats },
        { name: "Debates", value: user.progress.debates },
        { name: "Scenarios", value: user.progress.scenarios },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, bio, avatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
