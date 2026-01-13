import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debateTopics } from "../data/debateTopics";

function DebateStart() {
  const [customTopic, setCustomTopic] = useState("");
  const navigate = useNavigate();

  const startDebate = (topic) => {
    navigate("/debate-room", {
      state: { topic },
    });
  };

  const handleCustomStart = () => {
    if (customTopic.trim().length < 10) {
      alert("Please enter a clear debate topic.");
      return;
    }
    startDebate(customTopic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white p-8">

      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
          Debate Mode
        </h1>
        <p className="text-gray-600 dark:text-zinc-400">
          Pick a topic or create your own and debate with AI in real time.
        </p>
      </div>

      {/* Predefined Topics */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {debateTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => startDebate(topic.title)}
            className="group cursor-pointer bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.4)]"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-500 transition">
              {topic.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Click to start a debate on this topic.
            </p>
          </div>
        ))}
      </div>

      {/* OR Divider */}
      <div className="text-center text-gray-500 dark:text-zinc-500 mb-10">
        — OR —
      </div>

      {/* Custom Topic */}
      <div className="max-w-xl mx-auto bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-semibold mb-4">Create your own topic</h3>

        <input
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="Enter your own debate topic..."
          className="w-full p-4 rounded-xl bg-white/80 dark:bg-zinc-800 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        <button
          onClick={handleCustomStart}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
        >
          Start Debate
        </button>
      </div>

    </div>
  );
}

export default DebateStart;
