import React from "react";
import "../styles/chatbot.css";

const Message = ({ text, sender, icon }) => {
  return (
    <div className={`message ${sender}`}>
      <img src={icon} alt={`${sender} icon`} className="message-icon" />
      <div className="message-text" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

export default Message;
