import React, { useState, useRef, useEffect } from "react";
import { useChatWidget } from "../../context/ChatContext";
import { PLACEHOLDER_IMAGES } from "../../utils/placeholderImages";
import "./GlobalChatWidget.css";

const GlobalChatWidget = () => {
  const { isChatOpen, currentShop, closeChat } = useChatWidget();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "shop",
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  console.log('GlobalChatWidget render - isChatOpen:', isChatOpen, 'currentShop:', currentShop);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Mock shop response
      setTimeout(() => {
        const shopResponse = {
          id: messages.length + 2,
          text: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
          sender: "shop",
          time: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, shopResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    closeChat();
    setIsMinimized(false);
  };

  if (!isChatOpen) {
    return null;
  }

  return (
    <div className={`global-chat-widget ${isMinimized ? "minimized" : ""}`}>
      {isMinimized ? (
        <div className="chat-minimized" onClick={handleMaximize}>
          <img
            src={currentShop?.shopAvatar || PLACEHOLDER_IMAGES.avatar40}
            alt="Shop Avatar"
            className="minimized-avatar"
          />
          <div className="minimized-indicator">💬</div>
        </div>
      ) : (
        <div className="chat-expanded">
          <div className="chat-header">
            <div className="shop-info">
              <img
                src={currentShop?.shopAvatar || PLACEHOLDER_IMAGES.avatar40}
                alt="Shop Avatar"
                className="shop-avatar"
              />
              <div className="shop-details">
                <h4>{currentShop?.shopName || "PycShop"}</h4>
                <span className="online-status">🟢 Đang hoạt động</span>
              </div>
            </div>
            <div className="chat-controls">
              <button className="minimize-btn" onClick={handleMinimize}>
                ➖
              </button>
              <button className="close-btn" onClick={handleClose}>
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === "user" ? "user-message" : "shop-message"}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-btn">
              📤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatWidget;