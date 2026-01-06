import { useEffect, useRef, useState } from "react";

function VoiceLearning() {
  /* ---------------- STATES ---------------- */
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice learning history
  const [history, setHistory] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  const recognitionRef = useRef(null);

  /* ---------------- USER ---------------- */
  const loggedInUser = JSON.parse(localStorage.getItem("user"))?.name || "User";

  /* ---------------- FETCH VOICE HISTORY ---------------- */
  useEffect(() => {
    fetchVoiceHistory();
  }, []);

  const fetchVoiceHistory = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/voice/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setHistory(data);

        // 👇 AUTO-SELECT LATEST ITEM
        if (data.length > 0) {
          setActiveItem(data[0]);
        }
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

  /* ---------------- REMOVE EMOJIS ---------------- */
  const removeEmojis = (text) =>
    text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  /* ---------------- TEXT TO SPEECH ---------------- */
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(removeEmojis(text));
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- SEND TO VOICE LEARNING ---------------- */
  const sendForLearning = async () => {
    if (!transcript.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/voice", {
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
    await fetch(`http://localhost:8080/api/voice/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // remove from UI immediately
    setHistory((prev) => prev.filter((item) => item._id !== id));

    // clear active item if deleted
    if (activeItem?._id === id) {
      setActiveItem(null);
    }
  } catch (err) {
    console.error("Delete failed", err);
  }
};


  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen w-screen flex">
      {/* SIDEBAR */}
      <div className="w-[25%] bg-gray-100 p-3 border-r">
        <h2 className="font-semibold mb-3">Voice Learning History</h2>

       {history.map((item) => (
  <div
    key={item._id}
    className={`group flex justify-between items-center p-2 mb-2 rounded cursor-pointer text-sm ${
      activeItem?._id === item._id
        ? "bg-indigo-600 text-white"
        : "bg-white"
    }`}
  >
    <span onClick={() => setActiveItem(item)} className="truncate">
      {item.title}
    </span>

    <button
      onClick={() => deleteLearning(item._id)}
      className="ml-2 text-red-500 opacity-0 group-hover:opacity-100"
      title="Delete"
    >
      🗑️
    </button>
  </div>
))}

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-14 border-b flex items-center px-4 font-semibold">
          Welcome {loggedInUser}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {activeItem ? (
            <div className="space-y-3">
              <p>
                <b>You said:</b> {activeItem.originalText}
              </p>
              <p>
                <b>Corrected:</b> {activeItem.correctedText}
              </p>
              <p>
                <b>Explanation:</b> {activeItem.explanation}
              </p>
              <p>
                <b>Vocabulary:</b> {activeItem.vocabulary}
              </p>

              <button
                onClick={() => speakText(activeItem.correctedText)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                🔊 Listen
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Speak a sentence to start learning</p>
          )}

          {loading && (
            <p className="text-sm text-gray-400 italic mt-2">
              AI is thinking...
            </p>
          )}
        </div>

        {/* CONTROLS */}
        <div className="border-t p-4 bg-gray-50 flex flex-col gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`py-2 rounded text-white ${
              isListening ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {isListening ? "Stop Listening" : "Start Speaking"}
          </button>

          <button
            onClick={sendForLearning}
            disabled={!transcript}
            className="bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            Improve Sentence
          </button>

          <div className="bg-white p-3 rounded text-sm min-h-[50px]">
            {transcript || "Your speech will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceLearning;
