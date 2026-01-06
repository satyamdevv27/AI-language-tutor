import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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

  const MAX_ROUNDS = 4;

  const isSpeechSupported =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

  /* 🛑 STOP SPEECH WHEN LEAVING PAGE */
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
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /* ---------------- AI SPEAK ---------------- */
  const speakAI = (text) => {
    if (!("speechSynthesis" in window) || voices.length === 0) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const maleVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        /david|mark|alex|fred|male|man/i.test(v.name)
    );

    if (maleVoice) utterance.voice = maleVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  /* 🔊 SPEAK AI MESSAGE ONLY ONCE (FIXES REFRESH BUG) */
  useEffect(() => {
    if (!aiMessage) return;
    if (voices.length === 0) return;
    if (hasSpokenRef.current) return;

    speakAI(aiMessage);
    hasSpokenRef.current = true;
  }, [aiMessage, voices]);

  /* ---------------- START DEBATE ---------------- */
  useEffect(() => {
    if (!topic) return;

    const startDebate = async () => {
      setLoading(true);
      hasSpokenRef.current = false;

      try {
        const res = await fetch("http://localhost:8080/api/debate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            topic,
            message: "Start the debate.",
          }),
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
      const res = await fetch("http://localhost:8080/api/debate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          topic,
          message: userInput,
        }),
      });

      const data = await res.json();
      setAiMessage(data.reply);
      setUserInput("");

      setRound((prev) => {
        if (prev + 1 >= MAX_ROUNDS) {
          setDebateEnded(true);
        }
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
    const finalMessage =
      "Thank you for the debate. You presented your arguments confidently. Would you like feedback or start a new topic?";

    hasSpokenRef.current = false;
    setAiMessage(finalMessage);
    setDebateEnded(true);
  };

  /* 🔽 AUTO SCROLL ONLY WHEN DEBATE ENDS */
  useEffect(() => {
    if (debateEnded && endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [debateEnded]);

  if (!topic) {
    return <p className="p-6">No debate topic selected.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b p-4 font-semibold">
        Debate Topic: {topic}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* AI SPEECH BUBBLE */}
        <div
          ref={debateEnded ? endRef : null}
          className="relative max-w-xl mb-4"
        >
          <div className="bg-white p-4 rounded-xl shadow max-h-[250px] overflow-y-auto">
            {loading ? "AI is thinking..." : aiMessage}
          </div>
          <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>

        {/* AVATAR */}
        <div
          className={`w-40 h-40 flex items-center justify-center rounded-full bg-indigo-100 transition-all ${
            isSpeaking ? "scale-105 ring-4 ring-indigo-400" : ""
          }`}
        >
          <img
            src="/aidbtr.png"
            alt="AI Debater"
            className="max-h-full object-contain"
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          AI Debater {isSpeaking && "(Speaking...)"}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Round {round} / {MAX_ROUNDS}
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white border-t p-4">
        <button
          onClick={startListening}
          disabled={!isSpeechSupported || isListening || debateEnded}
          className={`w-full py-2 rounded text-white ${
            isListening ? "bg-red-600" : "bg-blue-600"
          } disabled:opacity-50`}
        >
          {isListening ? "Listening..." : "Start Speaking"}
        </button>

        <button
          onClick={sendToAI}
          disabled={loading || debateEnded}
          className="w-full mt-2 bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          Send
        </button>

        <button
          onClick={endDebate}
          disabled={debateEnded}
          className="w-full mt-2 bg-gray-700 text-white py-2 rounded disabled:opacity-50"
        >
          End Debate
        </button>

        <textarea
          className="mt-3 w-full border rounded p-2 text-sm"
          rows={2}
          placeholder="Your argument..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={debateEnded}
        />
      </div>
    </div>
  );
}

export default DebateRoom;
