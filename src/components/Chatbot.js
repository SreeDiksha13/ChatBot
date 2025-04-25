import React, { useState } from "react";
import Message from "./Message";
import "../styles/chatbot.css";
import chatbotLogo from "../round.png";
import userIcon from "../boy.png";
import botIcon from "../robot.png";
import Tesseract from "tesseract.js";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const allPrompts = [
    "What is AI?",
    "How does WiFi work?",
    "Why is the sky blue?",
    "What are clouds made of?",
    "Tell me a joke about programming!",
    "What’s a fun riddle to solve?",
    "How do airplanes stay in the air?",
    "What’s inside a black hole?",
    "Who invented pizza?",
    "What’s a cool fact about history?",
    "What’s a trending topic right now?",
    "What’s the biggest movie of the year?",
    "Tell me about global warming",
    "Best places to travel in India",
    "How can we reduce pollution",
  ];

  const [examplePrompts, setExamplePrompts] = useState(() =>
    allPrompts.sort(() => 0.5 - Math.random()).slice(0, 4)
  );

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/\n/g, "<br/>");
  };

  const sendMessage = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user", icon: userIcon };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const botResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I didn't understand that.";

      const botMessage = {
        text: formatResponse(botResponse),
        sender: "bot",
        icon: botIcon,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching response!", sender: "bot", icon: botIcon },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { text: "Processing image...", sender: "bot", icon: botIcon },
    ]);
    setLoading(true);

    try {
      const { data } = await Tesseract.recognize(file, "eng");
      const extractedText = data.text.trim();

      if (extractedText) {
        sendMessage(extractedText);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "No readable text found!", sender: "bot", icon: botIcon },
        ]);
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Failed to extract text from image!", sender: "bot", icon: botIcon },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={chatbotLogo} alt="Chatbot Logo" className="chatbot-logo" />
        <h2>Chatbot</h2>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} icon={msg.icon} />
        ))}
        {loading && <div className="loading-spinner"></div>}
      </div>

      <div className="example-prompts">
        {examplePrompts.map((prompt, index) => (
          <button key={index} className="prompt-button" onClick={() => sendMessage(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask something..."
          disabled={loading}
          className="chat-input"
        />
        <button onClick={() => sendMessage()} disabled={loading} className="chat-send-button">
          {loading ? "Sending..." : "Send"}
        </button>

        {/* Styled Image Upload Button */}
        <label htmlFor="imageUpload" className="image-upload-label">
          Upload Image
        </label>
        <input
          type="file"
          id="imageUpload"
          className="image-upload-input"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default Chatbot;
