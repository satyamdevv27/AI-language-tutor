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
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const startedRef = useRef(false); // prevents double start
  const hasSpokenRef = useRef(false); // prevents double speech

  const isSpeechSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  /* ================= LOAD VOICES ================= */
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const load = () => {  
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
      
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => (window.speechSynthesis.onvoiceschanged = null);
  }, []);

  /* ================= SPEAK AI ================= */
  const speakAI = (text) => {
    if (!("speechSynthesis" in window) || voices.length === 0) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    let selectedVoice = null;

    if (scenario.gender === "female") {
      selectedVoice = voices.find(
        (v) => /zira|hazel|samantha|victoria|female|woman/i.test(v.name)
      );
    } else {
      selectedVoice = voices.find(
        (v) => /david|mark|alex|fred|male|man/i.test(v.name)
      );
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };

  /* ================= SPEAK WHEN MESSAGE CHANGES ================= */
  useEffect(() => {
    if (!aiMessage || hasSpokenRef.current || voices.length === 0) return;
    speakAI(aiMessage);
    hasSpokenRef.current = true;
  }, [aiMessage, voices]);

  /* ================= INTRO MESSAGE ================= */
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

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white flex flex-col">

      <div className="h-14 flex items-center px-4 border-b border-black/10 dark:border-white/10 backdrop-blur-xl bg-white/60 dark:bg-black/40 font-semibold">
        {scenario.title}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative mb-4 max-w-xl">
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 rounded-2xl border border-black/10 dark:border-white/10">
            {aiMessage}
          </div>
          <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/70 dark:border-t-zinc-900/70" />
        </div>

        <img
          src={scenario.image}
          alt={scenario.character}
          className="h-56 object-contain"
        />

        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          {scenario.character}
        </p>
      </div>

      {"speechSynthesis" in window ? null : (
        <p className="text-sm text-yellow-600 text-center mb-2">
          AI voice is not supported in this browser.
        </p>
      )}

      <div className="border-t border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4">
        {!isSpeechSupported && (
          <div className="mb-3 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
            Voice input is not supported in this browser. Please type your response.
          </div>
        )}

        <button
          onClick={startListening}
          disabled={!isSpeechSupported || isListening}
          className={`w-full py-3 rounded-xl text-white ${
            isListening ? "bg-red-600" : "bg-indigo-600 hover:bg-indigo-500"
          } disabled:opacity-50`}
        >
          {isListening ? "Listening..." : "Start Speaking"}
        </button>

        <button
          onClick={sendToAI}
          disabled={loading}
          className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "AI is replying..." : "Send"}
        </button>

        <textarea
          className="mt-3 w-full rounded-xl p-3 bg-white/80 dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-sm"
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
