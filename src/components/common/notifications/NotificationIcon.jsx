import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationService from "../../../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load unread count on component mount and periodically
  const loadUnreadCount = async () => {
    try {
      setIsLoading(true);
      const response = await NotificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Error loading notification count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load unread count on mount
  useEffect(() => {
    loadUnreadCount();

    // Refresh count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Listen for storage changes (when user interacts with notifications in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "notifications_updated") {
        loadUnreadCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleClick = () => {
    setShowPanel(!showPanel);
    // Refresh count when opening panel
    if (!showPanel) {
      loadUnreadCount();
    }
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    // Refresh count when closing panel
    loadUnreadCount();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Thông báo"
      >
        <FontAwesomeIcon
          icon={["fas", "bell"]}
          className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={showPanel} onClose={handleClosePanel} />
    </>
  );
};

export default NotificationIcon;
