import React from "react";
import Chatbot from "./components/Chatbot";
import "./styles/chatbot.css";

const App = () => {
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        
        <h1 className="title"></h1>
      </nav>

      {/* Sidebar + Chat Area */}
      <div className="main-content">
        

        {/* Chat Area */}
        <div className="chat-area">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default App;
