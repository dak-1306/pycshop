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
    <div className="py-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={`mx-2 mb-2 p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
            activeConversation?.id === conversation.id
              ? "bg-blue-50 border-l-4 border-blue-500"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start space-x-3">
            {/* Avatar ổn định */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  conversation.customerAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    conversation.customerName
                  )}&background=6b7280&color=fff&size=48`
                }
                alt={conversation.customerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    conversation.customerName
                  )}&background=6b7280&color=fff&size=48`;
                }}
              />
              {conversation.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
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
                <p className="text-sm text-gray-600 truncate pr-2">
                  {conversation.lastMessage}
                </p>

                {conversation.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-5 px-1.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
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
