import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationService from "../../../services/notificationService";
import NotificationPanel from "./NotificationPanel";

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);

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

  useEffect(() => {
    loadUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
    </div>
  );
};

export default NotificationIcon;
