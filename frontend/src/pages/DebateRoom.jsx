import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function DebateRoom() {
  const { state } = useLocation();
  const topic = state?.topic;

  const [aiMessage, setAiMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [round, setRound] = useState(0);
  const [debateEnded, setDebateEnded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const endRef = useRef(null);
  const hasSpokenRef = useRef(false);
  const startedRef = useRef(false);

  const MAX_ROUNDS = 4;

  const isSpeechSupported =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

  /* ---------------- STOP VOICE WHEN LEAVING ---------------- */
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ---------------- LOAD VOICES ---------------- */
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => (window.speechSynthesis.onvoiceschanged = null);
  }, []);

  /* ---------------- SPEAK AI ---------------- */
  const speakAI = (text) => {
    if (!("speechSynthesis" in window) || voices.length === 0) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const maleVoice = voices.find(
      (v) => v.lang.startsWith("en") && /david|mark|alex|fred|male|man/i.test(v.name)
    );

    if (maleVoice) utterance.voice = maleVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  /* Speak whenever AI message changes */
  useEffect(() => {
    if (!aiMessage || voices.length === 0 || hasSpokenRef.current) return;
    speakAI(aiMessage);
    hasSpokenRef.current = true;
  }, [aiMessage, voices]);

  /* ---------------- START DEBATE (ONLY ONCE) ---------------- */
  useEffect(() => {
    if (!topic || startedRef.current) return;
    startedRef.current = true;
    hasSpokenRef.current = false;

    const startDebate = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/debate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ topic, message: "Start the debate." }),
        });

        const data = await res.json();
        setAiMessage(data.reply);
      } catch (err) {
        console.error("Debate start error", err);
      } finally {
        setLoading(false);
      }
    };

    startDebate();
  }, [topic]);

  /* ---------------- VOICE INPUT ---------------- */
  const startListening = () => {
    if (!isSpeechSupported || debateEnded) return;

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

  /* ---------------- SEND TO AI ---------------- */
  const sendToAI = async () => {
    if (!userInput.trim() || debateEnded) return;

    setLoading(true);
    hasSpokenRef.current = false;

    try {
      const res = await fetch(`${API_URL}/api/debate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ topic, message: userInput }),
      });

      const data = await res.json();
      setAiMessage(data.reply);
      setUserInput("");

      setRound((prev) => {
        if (prev + 1 >= MAX_ROUNDS) setDebateEnded(true);
        return prev + 1;
      });
    } catch (err) {
      console.error("Debate reply error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- END DEBATE ---------------- */
  const endDebate = () => {
    hasSpokenRef.current = false;
    setAiMessage(
      "Thank you for the debate. You presented your arguments confidently. Would you like feedback or start a new topic?"
    );
    setDebateEnded(true);
  };

  /* Auto scroll to thank you */
  useEffect(() => {
    if (debateEnded && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [debateEnded]);

  if (!topic) return <p className="p-6">No debate topic selected.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <div className="bg-white border-b p-4 font-semibold">
        Debate Topic: {topic}
      </div>

      <div className="flex-1 flex items-center justify-center p-6 gap-10">

        <div className="flex flex-col items-center">
          <div
            className={`w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center ${
              isSpeaking ? "ring-4 ring-indigo-400 scale-105" : ""
            }`}
          >
            <img src="/aidbtr.png" className="max-h-full" />
          </div>
          <p className="text-sm mt-2">AI Debater</p>
          <p className="text-xs text-gray-500">
            Round {round} / {MAX_ROUNDS}
          </p>
        </div>

        <div ref={debateEnded ? endRef : null} className="max-w-xl">
          <div className="bg-white p-4 rounded-xl shadow max-h-[250px] overflow-y-auto">
            {loading ? "AI is thinking..." : aiMessage}
          </div>
        </div>
      </div>

      <div className="bg-white border-t p-4">
        <button
          onClick={startListening}
          disabled={!isSpeechSupported || isListening || debateEnded}
          className="w-full py-2 bg-indigo-600 text-white rounded"
        >
          {isListening ? "Listening..." : "Start Speaking"}
        </button>

        <button
          onClick={sendToAI}
          disabled={loading || debateEnded}
          className="w-full mt-2 bg-green-600 text-white py-2 rounded"
        >
          Send
        </button>

        <button
          onClick={endDebate}
          disabled={debateEnded}
          className="w-full mt-2 bg-gray-700 text-white py-2 rounded"
        >
          End Debate
        </button>

        <textarea
          className="mt-2 w-full border p-2"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={debateEnded}
        />
      </div>
    </div>
  );
}

export default DebateRoom;
