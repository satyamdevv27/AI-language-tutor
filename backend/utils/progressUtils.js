export const calculateLearningScore = (progress) => {
  return (
        progress.chats * 5 +
    progress.debates * 10 +
    progress.scenarios * 10 
  );
};

export const getRank = (score) => {
  if (score < 200) return "Beginner";
  if (score < 500) return "Explorer";
  if (score < 900) return "Speaker";
  if (score < 1500) return "Communicator";
  return "Language Pro";
};
