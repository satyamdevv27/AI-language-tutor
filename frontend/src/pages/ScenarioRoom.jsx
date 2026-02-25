import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { scenarios } from "../data/scenario";

const API_URL = import.meta.env.VITE_API_URL;

function ScenarioRoom() {
  const { scenarioId } = useParams();
  const scenario = scenarios[scenarioId];

  const [aiMessage, setAiMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const startedRef = useRef(false);
  const hasSpokenRef = useRef(false);

  const isSpeechSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  /* ================= LOAD VOICES ================= */
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    let interval;
    if (loading) {
      setCountdown(5);
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  /* ================= SPEAK AI ================= */
  const speakAI = (text) => {
    if (!("speechSynthesis" in window) || !text || voices.length === 0) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(" " + text);
      utterance.lang = "en-US";

      let selectedVoice = null;
      if (scenario.gender === "female") {
        selectedVoice = voices.find((v) =>
          /zira|hazel|samantha|victoria|female/i.test(v.name)
        );
      } else {
        selectedVoice = voices.find((v) =>
          /david|alex|mark|fred|male/i.test(v.name)
        );
      }

      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.speak(utterance);
    }, 150);
  };

  /* ================= AUTO SPEAK ================= */
  useEffect(() => {
    if (!aiMessage || hasSpokenRef.current) return;
    speakAI(aiMessage);
    hasSpokenRef.current = true;
  }, [aiMessage, voices]);

  /* ================= START MESSAGE ================= */
  useEffect(() => {
    if (!scenario || startedRef.current) return;

    startedRef.current = true;
    hasSpokenRef.current = false;

    const start = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/scenario`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            scenarioId,
            message: "Start the conversation",
          }),
        });

        const data = await res.json();
        setAiMessage(data.reply);
      } catch (err) {
        console.error("Scenario AI error", err);
      } finally {
        setLoading(false);
      }
    };

    start();
  }, [scenarioId, scenario]);

  /* ================= VOICE INPUT ================= */
  const startListening = () => {
    if (!isSpeechSupported || isSpeaking || loading) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

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

  /* ================= SEND ================= */
  const sendToAI = async () => {
    if (!userInput.trim() || loading || isSpeaking) return;

    setLoading(true);
    hasSpokenRef.current = false;

    try {
      const res = await fetch(`${API_URL}/api/scenario`, {
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
      setUserInput("");
    } catch (err) {
      console.error("Scenario AI error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!scenario) return <p className="p-6">Scenario not found</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-white">

      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b p-4 font-semibold">
        {scenario.title}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div
            className={`w-40 h-40 rounded-full overflow-hidden 
                        bg-zinc-200 dark:bg-zinc-800 
                        flex items-center justify-center
                        shadow-lg transition-all duration-300
                        ${isSpeaking ? "ring-4 ring-indigo-400 scale-105 talking" : ""}
                      `}
          >
            <img
              src={scenario.image}
              alt="AI Character"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm mt-3 text-gray-600 dark:text-gray-400">
            {scenario.character}
          </p>
        </div>

        {/* Message Card */}
        <div className="max-w-xl w-full">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-md border dark:border-zinc-800 max-h-[250px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>
                  {countdown > 0
                    ? `AI is thinking... ${countdown}s`
                    : "Still working..."}
                </span>
              </div>
            ) : (
              aiMessage
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-zinc-900 border-t p-4 flex flex-col gap-3">

        <div className="flex gap-3 justify-center">
          <button
            onClick={startListening}
            disabled={!isSpeechSupported || isListening || isSpeaking || loading}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
          >
            🎤 {isListening ? "Listening..." : "Speak"}
          </button>

          <button
            onClick={sendToAI}
            disabled={loading || isSpeaking}
            className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white transition disabled:opacity-50"
          >
            📤 Send
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            🛑 End
          </button>
        </div>

        <textarea
          className="mt-3 w-full border rounded-xl p-3 dark:bg-zinc-800 dark:border-zinc-700"
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your response..."
          disabled={isSpeaking}
        />
      </div>
    </div>
  );
}

export default ScenarioRoom;