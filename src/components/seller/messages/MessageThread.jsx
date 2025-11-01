import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MessageThread = ({
  messages,
  currentSellerId,
  formatTime,
  isLoading,
  hasError,
  onRetry,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={["fas", "spinner"]}
              className="animate-spin text-xl text-orange-500"
            />
          </div>
          <p className="text-gray-600 font-medium">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-sm mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={["fas", "exclamation-triangle"]}
              className="text-2xl text-red-500"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không thể tải tin nhắn
          </h3>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Đã xảy ra lỗi khi tải tin nhắn. Vui lòng thử lại.
          </p>
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-sm mx-auto p-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={["fas", "paper-plane"]}
              className="text-2xl text-orange-500"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Bắt đầu cuộc trò chuyện
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Gửi tin nhắn đầu tiên để bắt đầu hỗ trợ khách hàng
          </p>
        </div>
      </div>
    );
  }

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {formatDate(date)}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {dateMessages.map((message, index) => {
                const isFromSeller = message.senderId === currentSellerId;
                const prevMessage = index > 0 ? dateMessages[index - 1] : null;
                const showAvatar =
                  !prevMessage || prevMessage.senderId !== message.senderId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isFromSeller ? "justify-end" : "justify-start"
                    } ${showAvatar ? "mt-4" : "mt-1"}`}
                  >
                    <div
                      className={`flex max-w-xs lg:max-w-lg ${
                        isFromSeller ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      {showAvatar && (
                        <div
                          className={`flex-shrink-0 ${
                            isFromSeller ? "ml-3" : "mr-3"
                          } self-end`}
                        >
                          <img
                            src={
                              message.senderAvatar ||
                              "/images/default-avatar.png"
                            }
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                            onError={(e) => {
                              e.target.src = "/images/default-avatar.png";
                            }}
                          />
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`${
                          showAvatar ? "" : isFromSeller ? "mr-11" : "ml-11"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl relative ${
                            isFromSeller
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                              : "bg-white text-gray-900 shadow-md border border-gray-100"
                          } ${
                            showAvatar
                              ? isFromSeller
                                ? "rounded-br-md"
                                : "rounded-bl-md"
                              : ""
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>

                        <div
                          className={`flex items-center mt-1 ${
                            isFromSeller ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-xs text-gray-500">
                            {formatTime(message.timestamp)}
                          </span>

                          {/* Read status for seller messages */}
                          {isFromSeller && (
                            <div className="ml-2">
                              {message.status === "delivered" && (
                                <FontAwesomeIcon
                                  icon={["fas", "check"]}
                                  className="text-gray-400 text-xs"
                                />
                              )}
                              {message.status === "read" && (
                                <FontAwesomeIcon
                                  icon={["fas", "check-double"]}
                                  className="text-blue-500 text-xs"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

MessageThread.propTypes = {
  messages: PropTypes.array.isRequired,
  currentSellerId: PropTypes.string.isRequired,
  formatTime: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  onRetry: PropTypes.func,
};

export default MessageThread;
