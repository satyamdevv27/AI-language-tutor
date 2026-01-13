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

  const loggedInUser = JSON.parse(localStorage.getItem("user"))?.name || "User";

  /* ---------------- FETCH SESSIONS ---------------- */
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/chat/sessions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
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

  /* ---------------- NEW CHAT ---------------- */
  const handleNewChat = async () => {
    if (creatingChatRef.current) return;
    creatingChatRef.current = true;
    setCreatingChat(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    if (!window.confirm("Delete this chat?")) return;
    try {
      await fetch(`http://localhost:8080/api/chat/session/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!input.trim() || loading || !activeSessionId) return;

    const userMessage = input;
    const isFirstMessage = messages.length === 0;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      if (isFirstMessage) {
        await fetch(
          `http://localhost:8080/api/chat/session/${activeSessionId}/title`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ title: userMessage.slice(0, 30) }),
          }
        );
        setSessions((prev) =>
          prev.map((s) =>
            s._id === activeSessionId
              ? { ...s, title: userMessage.slice(0, 30) }
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
    <div className="h-screen w-screen flex bg-gradient-to-br from-zinc-100 via-gray-100 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black text-gray-900 dark:text-white">

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-[75%]
        bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-r border-black/10 dark:border-white/10 p-4
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-[30%] lg:w-[25%]`}
      >
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="font-semibold text-lg">Chat History</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl">✖</button>
        </div>

        <h2 className="font-semibold mb-3 hidden md:block">Chat History</h2>

        <button
          ref={newChatBtnRef}
          onClick={handleNewChat}
          disabled={creatingChat}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl mb-4 disabled:opacity-50"
        >
          {creatingChat ? "Creating..." : "+ New Chat"}
        </button>

        {sessions.map((session) => (
          <div
            key={session._id}
            className={`group flex items-center justify-between p-3 mb-2 rounded-xl text-sm cursor-pointer
              ${
                activeSessionId === session._id
                  ? "bg-indigo-600 text-white"
                  : "bg-white/80 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-700"
              }`}
          >
            <div
              className="flex-1 truncate"
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
              className="ml-2 opacity-0 group-hover:opacity-100 text-red-500"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="w-full md:w-[70%] lg:w-[75%] flex flex-col">

        <div className="h-14 flex items-center justify-between px-4 border-b border-black/10 dark:border-white/10 backdrop-blur-xl bg-white/60 dark:bg-black/40 font-semibold">
          <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>☰</button>
          <span>Welcome {loggedInUser}</span>
          <div className="w-6 md:hidden" />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%]
                ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white/80 dark:bg-zinc-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-sm text-gray-500 dark:text-zinc-400 italic">
              🤖 AI is typing...
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="h-16 border-t border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl flex items-center gap-3 px-4">
          <input
            className="flex-1 h-10 rounded-xl px-3 bg-white/80 dark:bg-zinc-800 border border-black/10 dark:border-white/10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
