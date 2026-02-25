import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function VoiceLearning() {
  /* ---------------- STATES ---------------- */
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingTime, setThinkingTime] = useState(5);

  const [history, setHistory] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const recognitionRef = useRef(null);
  const loggedInUser =
    JSON.parse(localStorage.getItem("user"))?.name || "User";

  /* ---------------- PRELOAD VOICES ---------------- */
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  /* ---------------- COUNTDOWN TIMER ---------------- */
  useEffect(() => {
    let interval;

    if (loading) {
      setThinkingTime(5);

      interval = setInterval(() => {
        setThinkingTime((prev) => {
          if (prev > 1) return prev - 1;
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    fetchVoiceHistory();
  }, []);

  const fetchVoiceHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/voice/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
        if (data.length > 0) setActiveItem(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch voice history", err);
    }
  };

  /* ---------------- SPEECH RECOGNITION ---------------- */

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  /* ---------------- SPEECH SYNTHESIS FIXED ---------------- */

  const removeEmojis = (text) =>
    text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();

  const speakText = (text) => {
    if (!("speechSynthesis" in window) || !text) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    setTimeout(() => {
      const cleanText = " " + removeEmojis(text);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.speak(utterance);
    }, 150);
  };

  /* ---------------- SEND TO BACKEND ---------------- */

  const sendForLearning = async () => {
    if (!transcript.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: transcript }),
      });

      const data = await res.json();
      setActiveItem(data);
      setTranscript("");
      fetchVoiceHistory();
    } catch (err) {
      console.error("Voice learning error", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLearning = async (id) => {
    if (!window.confirm("Delete this learning record?")) return;

    try {
      await fetch(`${API_URL}/api/voice/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setHistory((prev) => prev.filter((item) => item._id !== id));
      if (activeItem?._id === id) setActiveItem(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white">

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-[75%] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-r border-black/10 dark:border-white/10 p-4 overflow-y-auto
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-[25%]`}
      >
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="font-semibold">Voice History</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-xl">✖</button>
        </div>

        <h2 className="font-semibold mb-4 hidden md:block">Voice History</h2>

        {history.map((item) => (
          <div
            key={item._id}
            className={`group flex justify-between items-center p-3 mb-2 rounded-xl cursor-pointer text-sm transition
            ${
              activeItem?._id === item._id
                ? "bg-indigo-600 text-white"
                : "bg-white/80 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-700"
            }`}
            onClick={() => {
              setActiveItem(item);
              setSidebarOpen(false);
            }}
          >
            <span className="truncate">{item.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteLearning(item._id);
              }}
              className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-black/10 dark:border-white/10 backdrop-blur-xl bg-white/60 dark:bg-black/40 font-semibold">
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>☰</button>
          <span>Welcome {loggedInUser}</span>
          <div className="w-6 md:hidden" />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {activeItem ? (
            <div className="space-y-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl border border-black/10 dark:border-white/10">
              <p><b>You said:</b> {activeItem.originalText}</p>
              <p><b>Corrected:</b> {activeItem.correctedText}</p>
              <p><b>Explanation:</b> {activeItem.explanation}</p>
              <p><b>Vocabulary:</b> {activeItem.vocabulary}</p>

              <button
                onClick={() => speakText(activeItem.correctedText)}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                🔊 Listen
              </button>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-zinc-400">
              Speak a sentence to start learning
            </p>
          )}

          {/* COUNTDOWN LOADING */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 italic mt-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>
                {thinkingTime > 0
                  ? `AI is thinking... ${thinkingTime}s`
                  : "Still working..."}
              </span>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="border-t border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 flex flex-col gap-3">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`py-3 rounded-xl text-white font-medium ${
              isListening ? "bg-red-600" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isListening ? "Stop Listening" : "Start Speaking"}
          </button>

          <button
            onClick={sendForLearning}
            disabled={!transcript}
            className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl disabled:opacity-50"
          >
            Improve Sentence
          </button>

          <div className="bg-white/80 dark:bg-zinc-800 p-3 rounded-xl text-sm min-h-[60px] border border-black/10 dark:border-white/10">
            {transcript || "Your speech will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceLearning;