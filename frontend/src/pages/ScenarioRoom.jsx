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

  /* ================= CLEANUP ON LEAVE / REFRESH ================= */
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
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

  /* ================= SPEAK AI (FIXED) ================= */
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
    }, 150); // prevents first-word cut
  };

  /* ================= AUTO SPEAK ================= */
  useEffect(() => {
    if (!aiMessage || hasSpokenRef.current) return;
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

  /* ================= SEND TO AI ================= */
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white flex flex-col">

      <div className="h-14 flex items-center px-4 border-b backdrop-blur-xl bg-white/60 dark:bg-black/40 font-semibold">
        {scenario.title}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative mb-4 max-w-xl">
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 rounded-2xl border">
            {loading ? (
              <div className="flex items-center gap-2 text-sm italic">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                {countdown > 0
                  ? `AI is thinking... ${countdown}s`
                  : "Still working..."}
              </div>
            ) : (
              aiMessage
            )}
          </div>
        </div>

        <img src={scenario.image} className="h-56 object-contain" />
        <p className="mt-2 text-sm text-gray-500">{scenario.character}</p>
      </div>

      <div className="border-t bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4">
        <button
          onClick={startListening}
          disabled={!isSpeechSupported || isListening || isSpeaking || loading}
          className={`w-full py-3 rounded-xl text-white ${
            isListening ? "bg-red-600" : "bg-indigo-600 hover:bg-indigo-500"
          } disabled:opacity-50`}
        >
          {isListening ? "Listening..." : "Start Speaking"}
        </button>

        <button
          onClick={sendToAI}
          disabled={loading || isSpeaking}
          className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl disabled:opacity-50"
        >
          Send
        </button>

        <textarea
          className="mt-3 w-full rounded-xl p-3 bg-white/80 dark:bg-zinc-800 border text-sm"
          rows={2}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Speak or type your response"
          disabled={isSpeaking}
        />
      </div>
    </div>
  );
}

export default ScenarioRoom;



// new changes
// import { useParams } from "react-router-dom";
// import { useEffect, useState, useRef } from "react";
// import { scenarios } from "../data/scenario";

// const API_URL = import.meta.env.VITE_API_URL;

// function ScenarioRoom() {
//   const { scenarioId } = useParams();
//   const scenario = scenarios[scenarioId];

//   const [aiMessage, setAiMessage] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [countdown, setCountdown] = useState(5);
//   const [voices, setVoices] = useState([]);

//   const recognitionRef = useRef(null);
//   const startedRef = useRef(false);
//   const hasSpokenRef = useRef(false);

//   const isSpeechSupported =
//     "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

//   /* ================= LOAD VOICES ================= */
//   useEffect(() => {
//     if (!("speechSynthesis" in window)) return;

//     const loadVoices = () => {
//       const v = window.speechSynthesis.getVoices();
//       if (v.length > 0) setVoices(v);
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, []);

//   /* ================= CLEANUP ON LEAVE ================= */
//   useEffect(() => {
//     return () => {
//       window.speechSynthesis.cancel();
//       recognitionRef.current?.stop();
//     };
//   }, []);

//   /* ================= COUNTDOWN TIMER ================= */
//   useEffect(() => {
//     let interval;

//     if (loading) {
//       setCountdown(5);
//       interval = setInterval(() => {
//         setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [loading]);

//   /* ================= SPEAK AI ================= */
//   const speakAI = (text) => {
//     if (!("speechSynthesis" in window) || !text || voices.length === 0) return;

//     const synth = window.speechSynthesis;
//     synth.cancel();

//     setTimeout(() => {
//       const utterance = new SpeechSynthesisUtterance(" " + text);
//       utterance.lang = "en-US";

//       let selectedVoice = null;
//       if (scenario.gender === "female") {
//         selectedVoice = voices.find((v) =>
//           /zira|hazel|samantha|victoria|female/i.test(v.name)
//         );
//       } else {
//         selectedVoice = voices.find((v) =>
//           /david|alex|mark|fred|male/i.test(v.name)
//         );
//       }

//       if (selectedVoice) utterance.voice = selectedVoice;

//       utterance.onstart = () => setIsSpeaking(true);
//       utterance.onend = () => setIsSpeaking(false);
//       utterance.onerror = () => setIsSpeaking(false);

//       synth.speak(utterance);
//     }, 150);
//   };

//   /* ================= AUTO SPEAK ================= */
//   useEffect(() => {
//     if (!aiMessage || hasSpokenRef.current || voices.length === 0) return;

//     speakAI(aiMessage);
//     hasSpokenRef.current = true;

//     // Save to sessionStorage
//     sessionStorage.setItem(
//       "scenarioSession",
//       JSON.stringify({
//         scenarioId,
//         aiMessage,
//       })
//     );
//   }, [aiMessage, voices]);

//   /* ================= RESTORE AFTER REFRESH ================= */
//   useEffect(() => {
//     const saved = sessionStorage.getItem("scenarioSession");

//     if (saved) {
//       const parsed = JSON.parse(saved);

//       if (parsed.scenarioId === scenarioId) {
//         hasSpokenRef.current = false;
//         setAiMessage(parsed.aiMessage);
//         return;
//       }
//     }
//   }, [scenarioId]);

//   /* ================= INTRO MESSAGE ================= */
//   useEffect(() => {
//     if (!scenario || startedRef.current) return;

//     const saved = sessionStorage.getItem("scenarioSession");
//     if (saved) return; // already restored

//     startedRef.current = true;
//     hasSpokenRef.current = false;

//     const start = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_URL}/api/scenario`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({
//             scenarioId,
//             message: "Start the conversation",
//           }),
//         });

//         const data = await res.json();
//         setAiMessage(data.reply);
//       } catch (err) {
//         console.error("Scenario AI error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     start();
//   }, [scenarioId, scenario]);

//   /* ================= VOICE INPUT ================= */
//   const startListening = () => {
//     if (!isSpeechSupported || isSpeaking || loading) return;

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

//   /* ================= SEND TO AI ================= */
//   const sendToAI = async () => {
//     if (!userInput.trim() || loading || isSpeaking) return;

//     setLoading(true);
//     hasSpokenRef.current = false;

//     try {
//       const res = await fetch(`${API_URL}/api/scenario`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           scenarioId,
//           message: userInput,
//         }),
//       });

//       const data = await res.json();
//       setAiMessage(data.reply);
//       setUserInput("");
//     } catch (err) {
//       console.error("Scenario AI error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!scenario) return <p className="p-6">Scenario not found</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white flex flex-col">

//       <div className="h-14 flex items-center px-4 border-b backdrop-blur-xl bg-white/60 dark:bg-black/40 font-semibold">
//         {scenario.title}
//       </div>

//       <div className="flex-1 flex flex-col items-center justify-center p-6">
//         <div className="relative mb-4 max-w-xl">
//           <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4 rounded-2xl border">
//             {loading ? (
//               <div className="flex items-center gap-2 text-sm italic">
//                 <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
//                 {countdown > 0
//                   ? `AI is thinking... ${countdown}s`
//                   : "Still working..."}
//               </div>
//             ) : (
//               aiMessage
//             )}
//           </div>
//         </div>

//         <img src={scenario.image} className="h-56 object-contain" />
//         <p className="mt-2 text-sm text-gray-500">{scenario.character}</p>
//       </div>

//       <div className="border-t bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-4">
//         <button
//           onClick={startListening}
//           disabled={!isSpeechSupported || isListening || isSpeaking || loading}
//           className={`w-full py-3 rounded-xl text-white ${
//             isListening ? "bg-red-600" : "bg-indigo-600 hover:bg-indigo-500"
//           } disabled:opacity-50`}
//         >
//           {isListening ? "Listening..." : "Start Speaking"}
//         </button>

//         <button
//           onClick={sendToAI}
//           disabled={loading || isSpeaking}
//           className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl disabled:opacity-50"
//         >
//           Send
//         </button>

//         <textarea
//           className="mt-3 w-full rounded-xl p-3 bg-white/80 dark:bg-zinc-800 border text-sm"
//           rows={2}
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Speak or type your response"
//           disabled={isSpeaking}
//         />
//       </div>
//     </div>
//   );
// }

// export default ScenarioRoom;