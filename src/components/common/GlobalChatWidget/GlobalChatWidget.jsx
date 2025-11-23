import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../../context/ChatContext";
import { useBuyerChat } from "../../../hooks/buyer/useBuyerChat";
import { PLACEHOLDER_IMAGES } from "../../../lib/utils/placeholderImages";
import "../../../styles/components/GlobalChatWidget.css";

const GlobalChatWidget = () => {
  const { isChatOpen, currentShop, closeChat } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);

  // Use real chat data instead of mock data
  const {
    conversations,
    activeConversation,
    messages,
    isLoading,
    isSending,
    error,
    createConversation,
    loadConversations,
    sendMessage,
    selectConversation,
    formatTime,
    getUnreadCount,
  } = useBuyerChat();

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
    // Chọn conversation đầu tiên khi mở chat
    if (isChatOpen && !activeConversation && conversations.length > 0) {
      selectConversation(conversations[0]);
    }
  }, [isChatOpen, activeConversation, conversations, selectConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || isSending) return;

    try {
      const success = await sendMessage(
        newMessage.trim(),
        activeConversation.id
      );
      if (success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("[GLOBAL_CHAT_WIDGET] Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conversation) => {
    selectConversation(conversation);
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

  const filteredConversations = conversations.filter((conversation) =>
    conversation.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isChatOpen) {
    return null;
  }

  return (
    <div className={`global-chat-widget ${isMinimized ? "minimized" : ""}`}>
      {isMinimized ? (
        <div className="chat-minimized" onClick={handleMaximize}>
          <img
            src={
              activeConversation?.sellerAvatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                activeConversation?.sellerName || "Shop"
              )}&background=6b7280&color=fff&size=40`
            }
            alt="Shop Avatar"
            className="minimized-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                activeConversation?.sellerName || "Shop"
              )}&background=6b7280&color=fff&size=40`;
            }}
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
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Đang tải tin nhắn...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`shop-item ${
                      activeConversation?.id === conversation.id ? "active" : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <img
                      src={
                        conversation.sellerAvatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          conversation.sellerName
                        )}&background=6b7280&color=fff&size=40`
                      }
                      alt={conversation.sellerName}
                      className="shop-item-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          conversation.sellerName
                        )}&background=6b7280&color=fff&size=40`;
                      }}
                    />
                    <div className="shop-item-info">
                      <div className="shop-item-name">
                        {conversation.shopName || conversation.sellerName}
                      </div>
                      <div className="shop-item-preview">
                        {conversation.lastMessage}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      <div className="shop-item-time">
                        {formatTime(conversation.lastMessageTime)}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="shop-item-badge">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Chưa có cuộc trò chuyện nào</p>
                </div>
              )}
            </div>
          </div>

          {/* Main chat area */}
          <div className="chat-main">
            <div className="chat-header">
              <div className="shop-info">
                <img
                  src={
                    activeConversation?.sellerAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activeConversation?.sellerName || "Shop"
                    )}&background=6b7280&color=fff&size=40`
                  }
                  alt="Shop Avatar"
                  className="shop-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activeConversation?.sellerName || "Shop"
                    )}&background=6b7280&color=fff&size=40`;
                  }}
                />
                <div className="shop-details">
                  <h4>
                    {activeConversation?.shopName ||
                      activeConversation?.sellerName ||
                      "PycShop"}
                  </h4>
                  <span className="online-status">
                    {activeConversation?.isOnline
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
                  <i className="fas fa-minus"></i>
                </button>
                <button
                  className="close-btn"
                  onClick={handleClose}
                  title="Đóng"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {error && (
                <div className="error-message">
                  <p>❌ {error}</p>
                </div>
              )}
              {messages.length > 0 ? (
                messages.map((message) => {
                  // Determine if message is from current user
                  const user = JSON.parse(localStorage.getItem("user") || "{}");
                  const currentUserId = (
                    user.id || user.ID_NguoiDung
                  )?.toString();
                  const isCurrentUser = message.senderId === currentUserId;

                  return (
                    <div
                      key={message.id}
                      className={`message ${
                        isCurrentUser ? "user-message" : "shop-message"
                      }`}
                    >
                      <div className="message-content">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : activeConversation ? (
                <div className="empty-messages">
                  <p>
                    Bắt đầu cuộc trò chuyện với {activeConversation.sellerName}
                  </p>
                </div>
              ) : (
                <div className="empty-messages">
                  <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <div className="input-container">
                {/* Attach Menu */}
                {showAttachMenu && (
                  <div className="attach-menu">
                    <button className="attach-menu-item" title="Gửi ảnh">
                      <i className="fas fa-image"></i>
                      <span>Ảnh</span>
                    </button>
                    <button className="attach-menu-item" title="Gửi file">
                      <i className="fas fa-file"></i>
                      <span>File</span>
                    </button>
                    <button className="attach-menu-item" title="Gửi vị trí">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Vị trí</span>
                    </button>
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {[
                      "😊",
                      "😂",
                      "❤️",
                      "👍",
                      "🎉",
                      "😢",
                      "😍",
                      "🔥",
                      "👏",
                      "🙏",
                      "💯",
                      "😎",
                      "🤔",
                      "😅",
                      "🥰",
                    ].map((emoji, index) => (
                      <button
                        key={index}
                        className="emoji-item"
                        onClick={() => {
                          setNewMessage(newMessage + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="input-actions-left">
                  <button
                    className="input-action-btn"
                    title="Đính kèm"
                    onClick={() => {
                      setShowAttachMenu(!showAttachMenu);
                      setShowEmojiPicker(false);
                    }}
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                </div>

                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="message-input"
                  rows="1"
                />
                <div className="input-actions">
                  <button
                    className="input-action-btn"
                    title="Emoji"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowAttachMenu(false);
                    }}
                  >
                    <i className="far fa-smile"></i>
                  </button>
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                className="send-btn"
                disabled={
                  !newMessage.trim() || !activeConversation || isSending
                }
                title={isSending ? "Đang gửi..." : "Gửi tin nhắn"}
              >
                {isSending ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatWidget;
