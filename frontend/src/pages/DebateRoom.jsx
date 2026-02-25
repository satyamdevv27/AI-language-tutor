// import { useLocation } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// const API_URL = import.meta.env.VITE_API_URL;

// function DebateRoom() {
//   const { state } = useLocation();
//   const topic = state?.topic;

//   const [aiMessage, setAiMessage] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [voices, setVoices] = useState([]);
//   const [round, setRound] = useState(0);
//   const [debateEnded, setDebateEnded] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const recognitionRef = useRef(null);
//   const endRef = useRef(null);
//   const hasSpokenRef = useRef(false);
//   const startedRef = useRef(false);

//   const MAX_ROUNDS = 4;

//   const isSpeechSupported =
//     "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

//   /* ---------------- STOP VOICE WHEN LEAVING ---------------- */
//   useEffect(() => {
//     return () => {
//       if ("speechSynthesis" in window) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   /* ---------------- LOAD VOICES ---------------- */
//   useEffect(() => {
//     if (!("speechSynthesis" in window)) return;

//     const loadVoices = () => {
//       const v = window.speechSynthesis.getVoices();
//       if (v.length > 0) setVoices(v);
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => (window.speechSynthesis.onvoiceschanged = null);
//   }, []);

//   /* ---------------- SPEAK AI ---------------- */
//   const speakAI = (text) => {
//     if (!("speechSynthesis" in window) || voices.length === 0) return;

//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";

//     const maleVoice = voices.find(
//       (v) => v.lang.startsWith("en") && /david|mark|alex|fred|male|man/i.test(v.name)
//     );

//     if (maleVoice) utterance.voice = maleVoice;

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);

//     window.speechSynthesis.speak(utterance);
//   };

//   /* Speak whenever AI message changes */
//   useEffect(() => {
//     if (!aiMessage || voices.length === 0 || hasSpokenRef.current) return;
//     speakAI(aiMessage);
//     hasSpokenRef.current = true;
//   }, [aiMessage, voices]);

//   /* ---------------- START DEBATE (ONLY ONCE) ---------------- */
//   useEffect(() => {
//     if (!topic || startedRef.current) return;
//     startedRef.current = true;
//     hasSpokenRef.current = false;

//     const startDebate = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_URL}/api/debate`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({ topic, message: "Start the debate." }),
//         });

//         const data = await res.json();
//         setAiMessage(data.reply);
//       } catch (err) {
//         console.error("Debate start error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     startDebate();
//   }, [topic]);

//   /* ---------------- VOICE INPUT ---------------- */
//   const startListening = () => {
//     if (!isSpeechSupported || debateEnded) return;

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";

//     recognition.onstart = () => {
//       setIsListening(true);
//       setUserInput("");
//     };

//     recognition.onresult = (event) => {
//       setUserInput(event.results[0][0].transcript);
//     };

//     recognition.onend = () => setIsListening(false);
//     recognition.onerror = () => setIsListening(false);

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   /* ---------------- SEND TO AI ---------------- */
//   const sendToAI = async () => {
//     if (!userInput.trim() || debateEnded) return;

//     setLoading(true);
//     hasSpokenRef.current = false;

//     try {
//       const res = await fetch(`${API_URL}/api/debate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ topic, message: userInput }),
//       });

//       const data = await res.json();
//       setAiMessage(data.reply);
//       setUserInput("");

//       setRound((prev) => {
//         if (prev + 1 >= MAX_ROUNDS) setDebateEnded(true);
//         return prev + 1;
//       });
//     } catch (err) {
//       console.error("Debate reply error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- END DEBATE ---------------- */
//   const endDebate = () => {
//     hasSpokenRef.current = false;
//     setAiMessage(
//       "Thank you for the debate. You presented your arguments confidently. Would you like feedback or start a new topic?"
//     );
//     setDebateEnded(true);
//   };

//   /* Auto scroll to thank you */
//   useEffect(() => {
//     if (debateEnded && endRef.current) {
//       endRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   }, [debateEnded]);

//   if (!topic) return <p className="p-6">No debate topic selected.</p>;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">

//       <div className="bg-white border-b p-4 font-semibold">
//         Debate Topic: {topic}
//       </div>

//       <div className="flex-1 flex items-center justify-center p-6 gap-10">

//         <div className="flex flex-col items-center">
//           <div
//             className={`w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center ${
//               isSpeaking ? "ring-4 ring-indigo-400 scale-105" : ""
//             }`}
//           >
//             <img src="/aidbtr.png" className="max-h-full" />
//           </div>
//           <p className="text-sm mt-2">AI Debater</p>
//           <p className="text-xs text-gray-500">
//             Round {round} / {MAX_ROUNDS}
//           </p>
//         </div>

//         <div ref={debateEnded ? endRef : null} className="max-w-xl">
//           <div className="bg-white p-4 rounded-xl shadow max-h-[250px] overflow-y-auto">
//             {loading ? "AI is thinking..." : aiMessage}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white border-t p-4">
//         <button
//           onClick={startListening}
//           disabled={!isSpeechSupported || isListening || debateEnded}
//           className="w-full py-2 bg-indigo-600 text-white rounded"
//         >
//           {isListening ? "Listening..." : "Start Speaking"}
//         </button>

//         <button
//           onClick={sendToAI}
//           disabled={loading || debateEnded}
//           className="w-full mt-2 bg-green-600 text-white py-2 rounded"
//         >
//           Send
//         </button>

//         <button
//           onClick={endDebate}
//           disabled={debateEnded}
//           className="w-full mt-2 bg-gray-700 text-white py-2 rounded"
//         >
//           End Debate
//         </button>

//         <textarea
//           className="mt-2 w-full border p-2"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           disabled={debateEnded}
//         />
//       </div>
//     </div>
//   );
// }

// export default DebateRoom;

// import { useLocation } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";

// const API_URL = import.meta.env.VITE_API_URL;

// function DebateRoom() {
//   const { state } = useLocation();
//   const topic = state?.topic;

//   const [aiMessage, setAiMessage] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [voices, setVoices] = useState([]);
//   const [round, setRound] = useState(0);
//   const [debateEnded, setDebateEnded] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const recognitionRef = useRef(null);
//   const endRef = useRef(null);

//   const MAX_ROUNDS = 4;

//   /* ---------------- LOAD VOICES ---------------- */
//   useEffect(() => {
//     if (!("speechSynthesis" in window)) return;

//     const loadVoices = () => {
//       const v = window.speechSynthesis.getVoices();
//       if (v.length > 0) setVoices(v);
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => (window.speechSynthesis.onvoiceschanged = null);
//   }, []);

//   /* ---------------- SPEAK AI ---------------- */
//   const speakAI = (text) => {
//     if (!("speechSynthesis" in window)) return;

//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.rate = 1.05;
//     utterance.pitch = 0.9;

//     const maleVoice = voices.find(
//       (v) => v.lang.startsWith("en") && /david|mark|alex|fred|male|man/i.test(v.name)
//     );

//     if (maleVoice) utterance.voice = maleVoice;

//     utterance.onstart = () => setIsSpeaking(true);
//     utterance.onend = () => setIsSpeaking(false);

//     window.speechSynthesis.speak(utterance);
//   };

//   /* Speak whenever AI message changes */
//   useEffect(() => {
//     if (!aiMessage || voices.length === 0) return;
//     speakAI(aiMessage);
//   }, [aiMessage, voices]);

//   /* ---------------- START DEBATE ---------------- */
//   useEffect(() => {
//     if (!topic) return;

//     const startDebate = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_URL}/api/debate`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({
//             topic,
//             message: "Start the debate.",
//           }),
//         });

//         const data = await res.json();
//         setAiMessage(data.reply);
//       } catch (err) {
//         console.error("Debate start error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     startDebate();
//   }, [topic]);

//   /* ---------------- VOICE INPUT ---------------- */
//   const startListening = () => {
//     if (debateEnded) return;

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) return;

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";

//     recognition.onstart = () => {
//       setIsListening(true);
//       setUserInput("");
//     };

//     recognition.onresult = (event) => {
//       setUserInput(event.results[0][0].transcript);
//     };

//     recognition.onend = () => setIsListening(false);
//     recognition.onerror = () => setIsListening(false);

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   /* ---------------- SEND TO AI ---------------- */
//   const sendToAI = async () => {
//     if (!userInput.trim() || debateEnded) return;

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_URL}/api/debate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           topic,
//           message: userInput,
//         }),
//       });

//       const data = await res.json();
//       setAiMessage(data.reply);
//       setUserInput("");

//       setRound((prev) => {
//         if (prev + 1 >= MAX_ROUNDS) setDebateEnded(true);
//         return prev + 1;
//       });
//     } catch (err) {
//       console.error("Debate reply error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- END DEBATE ---------------- */
//   const endDebate = () => {
//     setAiMessage(
//       "That was an engaging debate. You presented your arguments confidently. Would you like feedback or start a new topic?"
//     );
//     setDebateEnded(true);
//   };

//   if (!topic) return <p className="p-6">No debate topic selected.</p>;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">

//       <div className="bg-white border-b p-4 font-semibold">
//         Debate Topic: {topic}
//       </div>

//       <div className="flex-1 flex items-center justify-center p-6 gap-10">

//         <div className="flex flex-col items-center">
//           <div
//             className={`w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center ${
//               isSpeaking ? "ring-4 ring-indigo-400 scale-105" : ""
//             }`}
//           >
//             <img src="/aidbtr.png" className="max-h-full" />
//           </div>
//           <p className="text-sm mt-2">AI Debater</p>
//           <p className="text-xs text-gray-500">
//             Round {round} / {MAX_ROUNDS}
//           </p>
//         </div>

//         <div ref={debateEnded ? endRef : null} className="max-w-xl">
//           <div className="bg-white p-4 rounded-xl shadow max-h-[250px] overflow-y-auto">
//             {loading ? "AI is thinking..." : aiMessage}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white border-t p-4">
//         <button
//           onClick={startListening}
//           disabled={isListening || debateEnded}
//           className="w-full py-2 bg-indigo-600 text-white rounded"
//         >
//           {isListening ? "Listening..." : "Start Speaking"}
//         </button>

//         <button
//           onClick={sendToAI}
//           disabled={loading || debateEnded}
//           className="w-full mt-2 bg-green-600 text-white py-2 rounded"
//         >
//           Send
//         </button>

//         <button
//           onClick={endDebate}
//           disabled={debateEnded}
//           className="w-full mt-2 bg-gray-700 text-white py-2 rounded"
//         >
//           End Debate
//         </button>

//         <textarea
//           className="mt-2 w-full border p-2"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           disabled={debateEnded}
//         />
//       </div>
//     </div>
//   );
// }

// export default DebateRoom;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function DebateRoom() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const topic = state?.topic;

  const [aiMessage, setAiMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [debateEnded, setDebateEnded] = useState(false);

  const recognitionRef = useRef(null);

  /* ================= PRELOAD VOICES ================= */
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
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
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  /* ================= COUNTDOWN TIMER ================= */
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

  /* ================= SPEAK FUNCTION ================= */
  const speakAI = (text) => {
    if (!("speechSynthesis" in window) || !text) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(" " + text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;

      const voices = synth.getVoices();
      const englishVoice = voices.find((v) =>
        v.lang.toLowerCase().includes("en"),
      );
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synth.speak(utterance);
    }, 150);
  };

  /* ================= AUTO SPEAK ================= */
  useEffect(() => {
    if (!aiMessage) return;

    const timer = setTimeout(() => {
      speakAI(aiMessage);
    }, 300);

    return () => clearTimeout(timer);
  }, [aiMessage]);

  /* ================= START DEBATE ================= */
  const startDebate = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/debate`, {
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
      setDebateEnded(false);
    } catch (err) {
      console.error("Debate start error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!topic) return;
    startDebate();
  }, [topic]);

  /* ================= VOICE INPUT ================= */
  const startListening = () => {
    if (debateEnded || isSpeaking) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

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

  /* ================= SEND TO AI ================= */
  const sendToAI = async () => {
    if (!userInput.trim() || debateEnded) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/debate`, {
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
    } catch (err) {
      console.error("Debate reply error", err);
    } finally {
      setLoading(false);
    }
  };

  const endDebate = () => {
    const closingMessage =
      "Thank you for this engaging debate. You expressed your ideas clearly and confidently. Would you like to start a new topic?";

    setDebateEnded(true);
    setAiMessage(closingMessage);
  };

  if (!topic)
    return (
      <div className="p-6">
        <p>No debate topic selected.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b p-4 font-semibold">
        Debate Topic: {topic}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Avatar (Fixed + Optimized) */}
        <div className="flex flex-col items-center">
          <div
            className={`w-40 h-40 rounded-full overflow-hidden 
                        bg-zinc-200 dark:bg-zinc-800 
                        flex items-center justify-center
                        shadow-lg transition-all duration-300
                        ${isSpeaking ? "ring-4 ring-indigo-400 scale-105 talking " : ""}
                      `}
          >
            <img
              src="/aidbtr.png"
              alt="AI Debater"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm mt-3 text-gray-600 dark:text-gray-400">
            AI Debater
          </p>
        </div>

        {/* Message Card (Improved) */}
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
            disabled={isListening || debateEnded || isSpeaking || loading}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
          >
            🎤 {isListening ? "Listening..." : "Speak"}
          </button>

          <button
            onClick={sendToAI}
            disabled={loading || debateEnded}
            className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white transition disabled:opacity-50"
          >
            📤 Send
          </button>

          <button
            onClick={endDebate}
            disabled={debateEnded}
            className="px-6 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition disabled:opacity-50"
          >
            🛑 End
          </button>
        </div>

        <textarea
          className="mt-3 w-full border rounded-xl p-3 dark:bg-zinc-800 dark:border-zinc-700"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={debateEnded}
          placeholder="Type your argument..."
        />
      </div>
    </div>
  );
}

export default DebateRoom;
