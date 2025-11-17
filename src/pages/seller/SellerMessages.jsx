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
      <div className="flex h-[calc(100vh-4rem)] shadow-sm rounded-lg overflow-hidden bg-gray-100">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          {/* Search Header với nút làm mới */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <FontAwesomeIcon
                  icon={["fas", "search"]}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "times"]}
                      className="text-sm"
                    />
                  </button>
                )}
              </div>
              {/* Nút làm mới compact */}
              <button
                onClick={loadConversations}
                disabled={isLoading}
                className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors flex-shrink-0"
                title="Làm mới danh sách"
              >
                <FontAwesomeIcon
                  icon={["fas", "sync-alt"]}
                  className={`text-sm ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Conversation List - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <ConversationList
              conversations={filteredConversations}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              formatTime={formatTime}
              isLoading={isLoading}
            />
          </div>

          {/* Stats Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon
                  icon={["fas", "comments"]}
                  className="text-orange-500"
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

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {activeConversation ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={activeConversation.customerAvatar}
                        alt={activeConversation.customerName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            activeConversation.customerName
                          )}&background=f97316&color=fff&size=128`;
                        }}
                      />
                      {activeConversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-seller-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {activeConversation.customerName}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        {activeConversation.isOnline ? (
                          <>
                            <div className="w-2 h-2 bg-seller-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-seller-600 font-medium">
                              Đang hoạt động
                            </span>
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

                  {/* Chat actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                      title="Thông tin khách hàng"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "user-circle"]}
                        className="text-lg"
                      />
                    </button>
                    <button
                      className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                      title="Lịch sử đơn hàng"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "shopping-bag"]}
                        className="text-lg"
                      />
                    </button>
                    <button
                      className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                      title="Cài đặt cuộc trò chuyện"
                    >
                      <FontAwesomeIcon icon={["fas", "ellipsis-v"]} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Thread - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <MessageThread
                  messages={messages}
                  currentSellerId={user?.id}
                  formatTime={formatTime}
                  isLoading={isLoading}
                  hasError={hasError}
                  onRetry={handleRetryMessages}
                />
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="flex-shrink-0">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={!activeConversation}
                  isSending={isSending}
                  placeholder={`Trả lời ${activeConversation.customerName}...`}
                />
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={["fas", "comment-dots"]}
                    className="text-3xl text-orange-500"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Chọn một cuộc trò chuyện
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn
                  tin và hỗ trợ khách hàng của bạn
                </p>
                <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={["fas", "keyboard"]} />
                    <span>Phím tắt: Ctrl + /</span>
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
