import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { collegeInfo } from "../collegeInfo";

const App = () => {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: collegeInfo,
    },
  ]);

  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text!= "Typing..."), { role: "model", text, isError }]);
    };

    // Get the last user message
    const lastUserMessage = history[history.length - 1].text;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: lastUserMessage }),
    };

    try {
      // Call our new Vercel API route - Groq backend
      const response = await fetch('/api/chat', requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong!");
      
      // Update chat history with Groq's response
      updateHistory(data.reply);
    } catch (error) {
      // Update chat history with the error message
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) =>!prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">chat_bubble</span>
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">ASCET Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) =>!prev)} className="material-symbols-outlined">
            keyboard_arrow_down
          </button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Welcome to Audisankara College Assistant! 👋<br /><br />
              I'm here to help you with information about:
              <br /><br />
              • Admissions and Programs<br /><br />
              • Campus Life and Facilities<br /><br />
              • Academic Requirements<br /><br />
              • Financial Aid<br /><br />
              • And much more!<br /><br />
              How can I assist you today?
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;