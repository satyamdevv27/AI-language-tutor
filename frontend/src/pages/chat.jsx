import { useState, useRef, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);

  const chatEndRef = useRef(null);
  const creatingChatRef = useRef(false);
  const newChatBtnRef = useRef(null);

  /* ---------------- USER ---------------- */
  const [loggedInUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.name : "";
  });

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

          // ✅ auto open latest session
          if (data.length > 0) {
            setActiveSessionId(data[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      }
    };

    fetchSessions();
  }, []);

  /* ---------------- FETCH MESSAGES FOR ACTIVE SESSION ---------------- */
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

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [activeSessionId]);

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Delete this chat?")) return;

    try {
      await fetch(`http://localhost:8080/api/chat/session/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // remove from UI
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));

      // if deleted chat was open
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err,"Failed to delete chat");
    }
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- NEW CHAT ---------------- */
  const handleNewChat = async () => {
    // HARD STOP
    if (creatingChatRef.current) return;

    creatingChatRef.current = true;

    // 🔒 disable pointer immediately
    if (newChatBtnRef.current) {
      newChatBtnRef.current.style.pointerEvents = "none";
    }

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
      console.error("Failed to create new chat", err);
    } finally {
      creatingChatRef.current = false;
      setCreatingChat(false);

      // 🔓 re-enable pointer after micro-delay
      setTimeout(() => {
        if (newChatBtnRef.current) {
          newChatBtnRef.current.style.pointerEvents = "auto";
        }
      }, 300);
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */
const sendMessage = async () => {
  if (!input.trim() || loading) return;
  if (!activeSessionId) return;

  const isFirstMessage = messages.length === 0;
  const userMessage = input;

  setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
  setInput("");
  setLoading(true);

  try {
    // 🔹 rename chat if first message
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
            title: userMessage.slice(0, 30), // short & clean
          }),
        }
      );

      // update sidebar title instantly
      setSessions((prev) =>
        prev.map((s) =>
          s._id === activeSessionId
            ? { ...s, title: userMessage.slice(0, 30) }
            : s
        )
      );
    }

    // send message to backend
    const res = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        message: userMessage,
        sessionId: activeSessionId,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
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
        <h2 className="font-semibold mb-3">Chat History</h2>

        <button
          ref={newChatBtnRef}
          onClick={handleNewChat}
          disabled={creatingChat}
          className="w-full bg-indigo-600 text-white py-2 rounded mb-4
             disabled:opacity-50 disabled:cursor-not-allowed" 
        >
          {creatingChat ? "Creating..." : "+ New Chat"}
        </button>

        {sessions.map((session) => (
          <div
            key={session._id}
            className={`flex items-center justify-between p-2 mb-2 rounded text-sm
      ${
        activeSessionId === session._id
          ? "bg-indigo-600 text-white"
          : "bg-white hover:bg-gray-200"
      }`}
          >
            {/* Chat title */}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => {
                setActiveSessionId(session._id);
                setSidebarOpen(false);
              }}
            >
              {session.title}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDeleteSession(session._id)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Delete chat"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col">
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
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-400 italic">🤖 AI is typing...</p>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="h-16 border-t flex items-center gap-3 px-4 bg-gray-50">
          <input
            className="flex-1 h-10 border rounded px-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="h-10 px-4 bg-indigo-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
