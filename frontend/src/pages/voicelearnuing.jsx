import { useState, useRef, useEffect } from "react";

function VoiceLearning() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const creatingChatRef = useRef(false);

  /* ---------------- USER ---------------- */
  const loggedInUser = JSON.parse(localStorage.getItem("user"))?.name || "User";

  /* ---------------- FETCH SESSIONS ---------------- */
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/chat/sessions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setSessions(data);
          if (data.length > 0) setActiveSessionId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      }
    };

    fetchSessions();
  }, []);

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (!activeSessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/chat/history/${activeSessionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setMessages(
          Array.isArray(data)
            ? data.map((m) => ({ role: m.role, content: m.text }))
            : []
        );
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    fetchMessages();
  }, [activeSessionId]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- SPEECH RECOGNITION ---------------- */
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported");
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

  /* ---------------- remove Emoji ---------------- */

  const removeEmojis = (text) => {
    return (
      text
        // remove emojis & symbols
        .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
        // clean extra spaces
        .replace(/\s+/g, " ")
        .trim()
    );
  };

  /* ---------------- SPEAK AI ---------------- */
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = removeEmojis(text); 

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendToAI = async () => {
    if (!transcript.trim() || loading || !activeSessionId) return;

    const isFirstMessage = messages.length === 0;
    const spokenText = transcript;

    setMessages((prev) => [...prev, { role: "user", content: spokenText }]);
    setLoading(true);

    try {
      // rename chat on first message
      if (isFirstMessage) {
        await fetch(
          `http://localhost:8080/api/chat/session/${activeSessionId}/title`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: spokenText.slice(0, 30),
            }),
          }
        );

        setSessions((prev) =>
          prev.map((s) =>
            s._id === activeSessionId
              ? { ...s, title: spokenText.slice(0, 30) }
              : s
          )
        );
      }

      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: spokenText,
          sessionId: activeSessionId,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);

      speakText(data.reply);
      setTranscript("");
    } catch (err) {
      console.error("Voice AI error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- NEW CHAT ---------------- */
  const handleNewChat = async () => {
    if (creatingChatRef.current) return;

    creatingChatRef.current = true;
    setCreatingChat(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const newSession = await res.json();
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession._id);
      setMessages([]);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create chat", err);
    } finally {
      creatingChatRef.current = false;
      setCreatingChat(false);
    }
  };

  /* ---------------- DELETE CHAT ---------------- */
  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Delete this voice chat?")) return;

    try {
      await fetch(`http://localhost:8080/api/chat/session/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSessions((prev) => prev.filter((s) => s._id !== sessionId));

      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen w-screen flex">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-[75%] bg-gray-100 p-3
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-[30%] lg:w-[25%]`}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="font-semibold">Voice Chats</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl font-bold"
          >
            ✖
          </button>
        </div>

        <h2 className="font-semibold mb-3 hidden md:block">Voice Chats</h2>

        <button
          onClick={handleNewChat}
          disabled={creatingChat}
          className="w-full bg-indigo-600 text-white py-2 rounded mb-4
          disabled:opacity-50"
        >
          {creatingChat ? "Creating..." : "+ New Chat"}
        </button>

        {sessions.map((session) => (
          <div
            key={session._id}
            className={`group flex justify-between items-center p-2 mb-2 rounded text-sm
            ${
              activeSessionId === session._id
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            <div
              className="flex-1 truncate cursor-pointer"
              onClick={() => {
                setActiveSessionId(session._id);
                setSidebarOpen(false);
              }}
            >
              {session.title}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSession(session._id);
              }}
              className="opacity-0 group-hover:opacity-100 transition
              text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* MAIN AREA */}
      <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col">
        {/* HEADER */}
        <div className="h-14 border-b flex items-center justify-between px-4 font-semibold">
          <button
            className="md:hidden text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span>Welcome {loggedInUser}</span>
          <div className="w-6 md:hidden" />
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%]
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-400 italic">AI is thinking...</p>
          )}
          <div ref={chatEndRef} />
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
            onClick={sendToAI}
            disabled={!transcript}
            className="bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            Send to AI
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
