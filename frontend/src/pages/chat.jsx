import { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedInUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.name : "";
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    const res = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    setInput("");
    setLoading(false);
  };

  return (
    // <div>
    //   <h2>AI Language Tutor</h2>

    //   <div>
    //     {messages.map((m, i) => (
    //       <p key={i}>
    //         <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
    //       </p>
    //     ))}
    //     {loading && <p>AI is typing...</p>}
    //   </div>

    //   <input
    //     value={input}
    //     onChange={(e) => setInput(e.target.value)}
    //     placeholder="Type a sentence..."
    //   />
    //   <button onClick={sendMessage}>Send</button>
    // </div>
    <div className="h-screen w-full flex flex-col items-center bg-indigo-600 text-white pt-10">
      <div className="text-4xl ">Welcome {loggedInUser}</div>
      <div
        className="w-[80%] h-[70%] bg-white  border-2"
      ></div>
      <div className="flex items-center">
        <input
        type="text"
          className="w-full h-10 mt-4 te`xt-black px-2 rounded-l border-2"
          value={input}></input>
          <button onClick={sendMessage} className=" h-10 w-20 bg-white text-black">Send</button>
      </div>
    </div>
  );
}

export default Chat;
