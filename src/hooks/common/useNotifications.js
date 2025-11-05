import { useState, useEffect, useCallback } from "react";
import notificationService from "../../lib/services/notification.js";

export const useNotifications = (userType = "admin") => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotifications({
        userType,
        limit: 50,
      });

      if (response.success) {
        // Ensure notifications is always an array
        const notificationData = Array.isArray(response.data)
          ? response.data
          : [];
        setNotifications(notificationData);
        setUnreadCount(response.unreadCount || 0);
      } else {
        // If response is not successful, set empty array
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to fetch notifications");
      // Ensure notifications is empty array on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [userType]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await notificationService.deleteNotification(notificationId);

        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );

        // Update unread count if deleted notification was unread
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error("Error deleting notification:", err);
      }
    },
    [notifications]
  );

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error clearing all notifications:", err);
    }
  }, []);

  // Toggle notification panel
  const toggleNotifications = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close notification panel
  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = useCallback((type) => {
    const iconMap = {
      order: "shopping-bag",
      product: "cube",
      user: "user-plus",
      report: "exclamation-triangle",
      system: "cog",
      payment: "credit-card",
      shipping: "truck",
      review: "star",
      promotion: "tag",
      message: "envelope",
    };

    return iconMap[type] || "bell";
  }, []);

  // Get notification priority color
  const getPriorityColor = useCallback((priority) => {
    const colorMap = {
      high: "text-red-600 bg-red-100",
      medium: "text-yellow-600 bg-yellow-100",
      low: "text-blue-600 bg-blue-100",
    };

    return colorMap[priority] || "text-gray-600 bg-gray-100";
  }, []);

  // Format notification time
  const formatNotificationTime = useCallback((timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return "Vừa xong";
    } else if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return notificationTime.toLocaleDateString("vi-VN");
    }
  }, []);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up real-time notifications (websocket/polling)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    // State
    notifications,
    isOpen,
    unreadCount,
    isLoading,
    error,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    toggleNotifications,
    closeNotifications,
    fetchNotifications,

    // Helpers
    getNotificationIcon,
    getPriorityColor,
    formatNotificationTime,
    // Backwards-compatible alias used by components expecting `getRelativeTime`
    getRelativeTime: formatNotificationTime,
  };
};
