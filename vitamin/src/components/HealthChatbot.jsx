import { useState } from "react";
import "./HealthChatbot.css";

function HealthChatbot() {
  // Toggle open / close
  const [isOpen, setIsOpen] = useState(false);

  // Chat messages
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 Ask me about vitamin deficiency or symptoms." }
  ]);

  // Input text
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { sender: "user", text: input }];
    setMessages(updatedMessages);

    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Add bot reply
      setMessages([
        ...updatedMessages,
        { sender: "bot", text: data.reply }
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        { sender: "bot", text: "⚠️ Server error. Please try again." }
      ]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="chatbot-float-btn"
        onClick={() => setIsOpen(true)}
      >
        🤖
      </div>

      {/* Chatbox */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            Health Assistant 🤖
            <span
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about vitamin deficiency..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>

          <div className="chatbot-footer">
            Educational only. Consult a doctor.
          </div>
        </div>
      )}
    </>
  );
}

export default HealthChatbot;
