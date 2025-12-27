import { useState, useRef, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages or loading changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Get logged-in user safely
  const [loggedInUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.name : "";
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Add AI response
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-indigo-600 text-white p-4">
      
      {/* Header */}
      <div className="text-3xl font-semibold">
        Welcome {loggedInUser}
      </div>

      {/* Chat Area */}
      <div className="w-[80%] h-[70%] bg-white border-2 overflow-y-auto p-4 text-black rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[60%] ${
                msg.role === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* ✅ AI Typing Indicator */}
        {loading && (
          <div className="text-sm text-gray-500 italic">
            🤖 AI is typing...
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-3 w-[70%]">
        <input
          type="text"
          className="flex-1 h-10 text-black px-3 border-2 rounded outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a sentence..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="h-10 w-24 bg-white text-black cursor-pointer rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
