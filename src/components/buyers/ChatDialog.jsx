import React, { useState, useRef, useEffect } from "react";
import "./ChatDialog.css";

const ChatDialog = ({ isOpen, onClose, shop }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "shop",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setIsTyping(true);

      // Simulate shop response
      setTimeout(() => {
        const shopResponse = {
          id: messages.length + 2,
          text: "Cảm ơn bạn đã quan tâm! Tôi sẽ kiểm tra và phản hồi lại ngay.",
          sender: "shop",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, shopResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-shop-info">
            <img src={shop?.avatar} alt={shop?.name} className="chat-avatar" />
            <div className="chat-shop-details">
              <h3>{shop?.name}</h3>
              <span className="online-status">
                <i className="fas fa-circle"></i>
                Đang hoạt động
              </span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "user-message" : "shop-message"
              }`}
            >
              {message.sender === "shop" && (
                <img
                  src={shop?.avatar}
                  alt={shop?.name}
                  className="message-avatar"
                />
              )}
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.text}</p>
                </div>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message shop-message">
              <img
                src={shop?.avatar}
                alt={shop?.name}
                className="message-avatar"
              />
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-section">
          <div className="chat-input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="chat-input"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              className="send-btn"
              disabled={!newMessage.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <div className="chat-quick-actions">
            <button className="quick-action-btn">
              <i className="fas fa-image"></i>
              Hình ảnh
            </button>
            <button className="quick-action-btn">
              <i className="fas fa-file"></i>
              File
            </button>
            <button className="quick-action-btn">
              <i className="fas fa-smile"></i>
              Sticker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;