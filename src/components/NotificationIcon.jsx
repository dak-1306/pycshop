import React, { useState, useEffect } from "react";
import NotificationService from "../services/notificationService";

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load unread count on component mount
  const loadUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Error loading notification count:", error);
    }
  };

  // Load recent notifications for dropdown
  const loadRecentNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await NotificationService.getNotifications(1, 5, "all");
      if (response.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
      loadUnreadCount();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    loadRecentNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
      loadRecentNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="notification-container">
      <div className="notification-icon">
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      <div className="notification-dropdown">
        <div className="notification-dropdown-header">
          <h3>Thông báo mới nhận</h3>
        </div>

        <div className="notification-dropdown-content">
          {isLoading ? (
            <div className="notification-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Đang tải...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <div className="notification-empty-icon">
                <i className="fas fa-bell-slash"></i>
              </div>
              <p>Chưa có thông báo mới</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                  onClick={() => !notification.isRead && markAsRead(notification.notificationId)}
                >
                  <div className="notification-item-icon">
                    <i className={`fas fa-${NotificationService.getNotificationIcon(notification.type)}`}></i>
                  </div>
                  <div className="notification-item-content">
                    <p className="notification-item-text">{notification.content}</p>
                    <span className="notification-item-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="notification-item-badge"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="notification-dropdown-footer">
          <a href="/notifications" className="view-all-notifications">
            Xem tất cả thông báo
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotificationIcon;
