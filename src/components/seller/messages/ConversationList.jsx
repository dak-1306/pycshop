import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ConversationList = ({
  conversations,
  activeConversation,
  onSelectConversation,
  formatTime,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FontAwesomeIcon
            icon={["fas", "spinner"]}
            className="animate-spin text-2xl text-orange-500 mb-2"
          />
          <p className="text-gray-600">Đang tải tin nhắn...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FontAwesomeIcon
            icon={["fas", "comments"]}
            className="text-4xl text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có tin nhắn nào
          </h3>
          <p className="text-gray-600">Khách hàng sẽ liên hệ với bạn qua đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-orange-50 ${
            activeConversation?.id === conversation.id
              ? "bg-orange-100 border-l-4 border-orange-500"
              : "bg-white hover:shadow-md"
          }`}
        >
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  conversation.customerAvatar || "/images/default-avatar.png"
                }
                alt={conversation.customerName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/default-avatar.png";
                }}
              />
              {conversation.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {conversation.customerName}
                </h3>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {formatTime(conversation.lastMessageTime)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>

                {conversation.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full ml-2 flex-shrink-0">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>

              {/* Online status */}
              {conversation.isOnline && (
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600">Đang hoạt động</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ConversationList.propTypes = {
  conversations: PropTypes.array.isRequired,
  activeConversation: PropTypes.object,
  onSelectConversation: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ConversationList;
