import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../../context/ChatContext";
import { PLACEHOLDER_IMAGES } from "../../../lib/utils/placeholderImages";
import "./GlobalChatWidget.css";

const GlobalChatWidget = () => {
  const { isChatOpen, currentShop, closeChat } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Mock data cho danh sách shop
  const [shopList] = useState([
    {
      id: 1,
      name: "PycShop",
      avatar: PLACEHOLDER_IMAGES.avatar40,
      lastMessage: "Cảm ơn bạn đã liên hệ!",
      time: "10:30",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 2,
      name: "Tech Store",
      avatar: PLACEHOLDER_IMAGES.avatar40,
      lastMessage: "Sản phẩm còn hàng không?",
      time: "09:45",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 3,
      name: "Fashion World",
      avatar: PLACEHOLDER_IMAGES.avatar40,
      lastMessage: "Khi nào có hàng mới?",
      time: "Hôm qua",
      unreadCount: 1,
      isOnline: false,
    },
  ]);

  console.log(
    "GlobalChatWidget render - isChatOpen:",
    isChatOpen,
    "currentShop:",
    currentShop
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Chọn shop đầu tiên khi mở chat
    if (isChatOpen && !selectedShop && shopList.length > 0) {
      setSelectedShop(shopList[0]);
    }
  }, [isChatOpen, selectedShop, shopList]);

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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
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

  const filteredShops = shopList.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isChatOpen) {
    return null;
  }

  return (
    <div className={`global-chat-widget ${isMinimized ? "minimized" : ""}`}>
      {isMinimized ? (
        <div className="chat-minimized" onClick={handleMaximize}>
          <img
            src={selectedShop?.avatar || PLACEHOLDER_IMAGES.avatar40}
            alt="Shop Avatar"
            className="minimized-avatar"
          />
          <div className="minimized-indicator">💬</div>
        </div>
      ) : (
        <div className="chat-expanded">
          {/* Sidebar danh sách shop */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h3>Đoạn chat</h3>
            </div>

            <div className="chat-search">
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="shop-list">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className={`shop-item ${
                    selectedShop?.id === shop.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectShop(shop)}
                >
                  <img
                    src={shop.avatar}
                    alt={shop.name}
                    className="shop-item-avatar"
                  />
                  <div className="shop-item-info">
                    <div className="shop-item-name">{shop.name}</div>
                    <div className="shop-item-preview">{shop.lastMessage}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <div className="shop-item-time">{shop.time}</div>
                    {shop.unreadCount > 0 && (
                      <div className="shop-item-badge">{shop.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main chat area */}
          <div className="chat-main">
            <div className="chat-header">
              <div className="shop-info">
                <img
                  src={selectedShop?.avatar || PLACEHOLDER_IMAGES.avatar40}
                  alt="Shop Avatar"
                  className="shop-avatar"
                />
                <div className="shop-details">
                  <h4>{selectedShop?.name || "PycShop"}</h4>
                  <span className="online-status">
                    {selectedShop?.isOnline
                      ? "🟢 Đang hoạt động"
                      : "⚪ Không hoạt động"}
                  </span>
                </div>
              </div>
              <div className="chat-controls">
                <button
                  className="minimize-btn"
                  onClick={handleMinimize}
                  title="Thu nhỏ"
                >
                  ➖
                </button>
                <button
                  className="close-btn"
                  onClick={handleClose}
                  title="Đóng"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender === "user" ? "user-message" : "shop-message"
                  }`}
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
              <div className="input-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="message-input"
                  rows="1"
                />
                <div className="input-actions">
                  <button className="input-action-btn" title="Gửi ảnh">
                    📷
                  </button>
                  <button className="input-action-btn" title="Gửi file">
                    📎
                  </button>
                  <button className="input-action-btn" title="Emoji">
                    😊
                  </button>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                className="send-btn"
                disabled={!newMessage.trim()}
                title="Gửi tin nhắn"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatWidget;
