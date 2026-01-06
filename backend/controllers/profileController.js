import User from "../models/user.js";
import VoiceLearning from "../models/voicelearning.js";
// import Debate from "../models/"; // if exists
// import Scenario from "../models/scenario.js"; // if exists

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    const voiceCount = await VoiceLearning.countDocuments({ userId });
    const debateCount = await Debate.countDocuments({ userId });
    const scenarioCount = await Scenario.countDocuments({ userId });

    res.json({
      user,
      progress: {
        voice: voiceCount,
        debate: debateCount,
        scenario: scenarioCount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};
