import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  getRelativeTime,
  getPriorityColor,
  getNotificationIcon,
}) => {
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Ensure notifications is an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const unreadNotifications = safeNotifications.filter((n) => !n.isRead);
  const readNotifications = safeNotifications.filter((n) => n.isRead);

  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      ref={panelRef}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Actions */}
      {safeNotifications.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {safeNotifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM10.07 2.82l-.9 1.46A9.949 9.949 0 0112 4a9.949 9.949 0 012.83.28l-.9-1.46A11.947 11.947 0 0010.07 2.82z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
              />
            </svg>
            <p className="text-gray-500 text-sm">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <>
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                  <p className="text-sm font-medium text-blue-800">
                    Chưa đọc ({unreadNotifications.length})
                  </p>
                </div>
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDeleteNotification}
                    onClose={onClose}
                    getRelativeTime={getRelativeTime}
                    getPriorityColor={getPriorityColor}
                    getNotificationIcon={getNotificationIcon}
                    isUnread={true}
                  />
                ))}
              </>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <>
                {unreadNotifications.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-600">Đã đọc</p>
                  </div>
                )}
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDeleteNotification}
                    onClose={onClose}
                    getRelativeTime={getRelativeTime}
                    getPriorityColor={getPriorityColor}
                    getNotificationIcon={getNotificationIcon}
                    isUnread={false}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Individual notification item component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClose,
  getRelativeTime,
  getPriorityColor,
  getNotificationIcon,
  isUnread,
}) => {
  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(notification.id);
  };

  const handleMarkAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <div
      className={`relative group ${
        isUnread ? "bg-blue-50" : "bg-white"
      } hover:bg-gray-50`}
    >
      {notification.actionUrl ? (
        <Link
          to={notification.actionUrl}
          className="block px-4 py-3"
          onClick={handleClick}
        >
          <NotificationContent
            notification={notification}
            getRelativeTime={getRelativeTime}
            getPriorityColor={getPriorityColor}
            getNotificationIcon={getNotificationIcon}
            isUnread={isUnread}
          />
        </Link>
      ) : (
        <div className="px-4 py-3" onClick={handleClick}>
          <NotificationContent
            notification={notification}
            getRelativeTime={getRelativeTime}
            getPriorityColor={getPriorityColor}
            getNotificationIcon={getNotificationIcon}
            isUnread={isUnread}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        {isUnread && (
          <button
            onClick={handleMarkAsRead}
            className="p-1 text-blue-600 hover:text-blue-800 bg-white rounded shadow-sm"
            title="Đánh dấu đã đọc"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1 text-red-600 hover:text-red-800 bg-white rounded shadow-sm"
          title="Xóa thông báo"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
      )}
    </div>
  );
};

// Notification content component
const NotificationContent = ({
  notification,
  getRelativeTime,
  getPriorityColor,
  getNotificationIcon,
  isUnread,
}) => {
  return (
    <div className="flex items-start space-x-3">
      {/* Icon */}
      <div
        className={`flex-shrink-0 p-2 rounded-lg ${getPriorityColor(
          notification.priority
        )}`}
      >
        {getNotificationIcon(notification.icon)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                isUnread ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {notification.title}
            </p>
            <p
              className={`text-xs mt-1 ${
                isUnread ? "text-gray-600" : "text-gray-500"
              }`}
            >
              {notification.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            {getRelativeTime(notification.timestamp)}
          </p>

          {/* Priority badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              notification.priority === "high"
                ? "bg-red-100 text-red-800"
                : notification.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {notification.priority === "high"
              ? "Quan trọng"
              : notification.priority === "medium"
              ? "Trung bình"
              : "Thấp"}
          </span>
        </div>
      </div>
    </div>
  );
};

NotificationPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.array,
  unreadCount: PropTypes.number,
  onMarkAsRead: PropTypes.func,
  onMarkAllAsRead: PropTypes.func,
  onDeleteNotification: PropTypes.func,
  onClearAll: PropTypes.func,
  getRelativeTime: PropTypes.func,
  getPriorityColor: PropTypes.func,
  getNotificationIcon: PropTypes.func,
};

NotificationPanel.defaultProps = {
  notifications: [],
  unreadCount: 0,
  onMarkAsRead: () => {},
  onMarkAllAsRead: () => {},
  onDeleteNotification: () => {},
  onClearAll: () => {},
  getRelativeTime: () => "Unknown time",
  getPriorityColor: () => "bg-gray-100",
  getNotificationIcon: () => "📄",
};

export default NotificationPanel;
