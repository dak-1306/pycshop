import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../hooks/seller/useMessages";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import ConversationList from "../../components/seller/messages/ConversationList";
import MessageThread from "../../components/seller/messages/MessageThread";
import MessageInput from "../../components/seller/messages/MessageInput";

const SellerMessages = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    conversations,
    messages,
    activeConversation,
    isLoading,
    hasError,
    isSending,
    loadConversations,
    selectConversation,
    sendMessage,
    markAsRead,
  } = useMessages();

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (activeConversation && activeConversation.unreadCount > 0) {
      markAsRead(activeConversation.id);
    }
  }, [activeConversation, markAsRead]);

  // Format time helper
  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return minutes <= 0 ? "Vừa xong" : `${minutes} phút`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ`;
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  }, []);

  // Search conversations
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle message send
  const handleSendMessage = useCallback(
    async (content) => {
      if (!activeConversation) return;

      try {
        await sendMessage(content, activeConversation.id);
      } catch (error) {
        console.error("Failed to send message:", error);
        // TODO: Show error notification
      }
    },
    [activeConversation, sendMessage]
  );

  // Handle conversation selection
  const handleSelectConversation = useCallback(
    (conversation) => {
      selectConversation(conversation);
    },
    [selectConversation]
  );

  // Handle retry loading
  const handleRetryMessages = useCallback(() => {
    if (activeConversation) {
      selectConversation(activeConversation);
    }
  }, [activeConversation, selectConversation]);

  return (
    <SellerLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 flex flex-col">
          {/* Header đơn giản */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Tin nhắn
                </h2>
                <p className="text-gray-500 text-sm">Hỗ trợ khách hàng</p>
              </div>
              <button
                onClick={loadConversations}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Làm mới danh sách"
              >
                <FontAwesomeIcon
                  icon={["fas", "sync-alt"]}
                  className={`text-sm ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {/* Search đơn giản */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={["fas", "search"]}
                  className="text-gray-400 text-sm"
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khách hàng..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={["fas", "times"]}
                    className="text-sm"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Conversation List - Scrollable với custom style */}
          <div
            className="flex-1 overflow-y-auto p-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 transparent",
            }}
          >
            <ConversationList
              conversations={filteredConversations}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              formatTime={formatTime}
              isLoading={isLoading}
            />
          </div>

          {/* Stats Footer đơn giản */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon
                  icon={["fas", "comments"]}
                  className="text-gray-400"
                />
                <span className="font-medium">{conversations.length}</span>
                <span>cuộc trò chuyện</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">
                  {conversations.reduce(
                    (acc, conv) => acc + (conv.unreadCount || 0),
                    0
                  )}
                </span>
                <span>chưa đọc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area với gradient background */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
          {activeConversation ? (
            <>
              {/* Chat Header đơn giản */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={
                          activeConversation.customerAvatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            activeConversation.customerName
                          )}&background=6b7280&color=fff&size=128`
                        }
                        alt={activeConversation.customerName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            activeConversation.customerName
                          )}&background=6b7280&color=fff&size=128`;
                        }}
                      />
                      {activeConversation.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {activeConversation.customerName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        {activeConversation.isOnline ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>Đang hoạt động</span>
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={["fas", "clock"]}
                              className="mr-2 text-xs"
                            />
                            Hoạt động{" "}
                            {formatTime(activeConversation.lastActiveTime)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chat actions đơn giản */}
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Thông tin khách hàng"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "user-circle"]}
                        className="text-lg"
                      />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Lịch sử đơn hàng"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "shopping-bag"]}
                        className="text-lg"
                      />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Tùy chọn"
                    >
                      <FontAwesomeIcon icon={["fas", "ellipsis-v"]} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Thread - Scrollable với custom styling */}
              <div
                className="flex-1 overflow-y-auto p-4"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 transparent",
                }}
              >
                <MessageThread
                  messages={messages}
                  currentSellerId={user?.id}
                  formatTime={formatTime}
                  isLoading={isLoading}
                  hasError={hasError}
                  onRetry={handleRetryMessages}
                />
              </div>

              {/* Message Input - Fixed at bottom với shadow */}
              <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 shadow-2xl">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={!activeConversation}
                  isSending={isSending}
                  placeholder={`Trả lời ${activeConversation.customerName}...`}
                />
              </div>
            </>
          ) : (
            /* No conversation selected - Clean empty state */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={["fas", "comment-dots"]}
                    className="text-2xl text-gray-400"
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Chọn cuộc trò chuyện
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ
                  trợ khách hàng.
                </p>

                <div className="text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-1">
                    <FontAwesomeIcon icon={["fas", "keyboard"]} />
                    <span>Nhấn Ctrl + / để tìm kiếm</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerMessages;
