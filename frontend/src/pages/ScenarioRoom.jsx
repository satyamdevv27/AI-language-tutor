import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { scenarios } from "../data/scenario";

function ScenarioRoom() {
  const { scenarioId } = useParams();
  const scenario = scenarios[scenarioId];

  const [aiMessage, setAiMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);

  const isSpeechSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  /* ================= SPEAK AI ================= */
  const speakAI = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (scenario.gender === "female") {
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          /zira|hazel|samantha|victoria|female|woman/i.test(v.name)
      );
    } else if (scenario.gender === "male") {
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          /david|mark|alex|fred|male|man/i.test(v.name)
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  /* ================= INTRO MESSAGE ================= */
  useEffect(() => {
    if (scenario) {
      setAiMessage(scenario.intro);
      speakAI(scenario.intro);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  if (!scenario) {
    return <p className="p-6">Scenario not found</p>;
  }

  /* ================= VOICE INPUT ================= */
  const startListening = () => {
    if (!isSpeechSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setUserInput("");
    };

    recognition.onresult = (event) => {
      setUserInput(event.results[0][0].transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  /* ================= SEND TO AI ================= */
  const sendToAI = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          scenarioId,
          message: userInput,
        }),
      });

      const data = await res.json();

      setAiMessage(data.reply);
      speakAI(data.reply);
      setUserInput("");
    } catch (err) {
      console.error("Scenario AI error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="h-14 bg-white border-b flex items-center px-4 font-semibold">
        {scenario.title}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Speech Bubble */}
        <div className="relative mb-4 max-w-xl">
          <div className="bg-white p-4 rounded-xl shadow text-gray-800">
            {aiMessage}
          </div>
          <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>

        {/* Character */}
        <img
          src={scenario.image}
          alt={scenario.character}
          className="h-56 object-contain"
        />

        <p className="mt-2 text-sm text-gray-600">
          {scenario.character}
        </p>
      </div>

      {/* WARNINGS */}
      {"speechSynthesis" in window ? null : (
        <p className="text-sm text-yellow-600 text-center mb-2">
          AI voice is not supported in this browser.
        </p>
      )}

      {/* CONTROLS */}
      <div className="bg-white border-t p-4">
        {!isSpeechSupported && (
          <div className="mb-3 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
            Voice input is not supported in this browser. Please type your
            response.
          </div>
        )}

        <button
          onClick={startListening}
          disabled={!isSpeechSupported || isListening}
          className={`w-full py-2 rounded text-white ${
            isListening ? "bg-red-600" : "bg-blue-600"
          } disabled:opacity-50`}
        >
          {isListening ? "Listening..." : "Start Speaking"}
        </button>

        <button
          onClick={sendToAI}
          disabled={loading}
          className="w-full mt-2 bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "AI is replying..." : "Send"}
        </button>

        <textarea
          className="mt-3 w-full border rounded p-2 text-sm"
          rows={2}
          placeholder="Your response will appear here (or type manually)"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ScenarioRoom;
