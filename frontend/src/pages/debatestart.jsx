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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-4">Debate Mode</h1>

      {/* Predefined topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {debateTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => startDebate(topic.title)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-indigo-50"
          >
            {topic.title}
          </div>
        ))}
      </div>

      <div className="text-center mb-3 text-gray-500">OR</div>

      {/* Custom topic */}
      <div className="max-w-xl mx-auto">
        <input
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="Enter your own debate topic"
          className="w-full border p-3 rounded mb-2"
        />
        <button
          onClick={handleCustomStart}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Start Debate
        </button>
      </div>
    </div>
  );
}

export default DebateStart;
