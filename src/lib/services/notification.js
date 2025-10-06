import api from "./api.js";

export const notificationService = {
  // Get notifications
  getNotifications: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/notifications?${queryString}`);
      return response;
    } catch (error) {
      console.error("Get notifications error:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response;
    } catch (error) {
      console.error("Mark notification as read error:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch("/notifications/read-all");
      return response;
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response;
    } catch (error) {
      console.error("Delete notification error:", error);
      throw error;
    }
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    try {
      const response = await api.delete("/notifications/clear-all");
      return response;
    } catch (error) {
      console.error("Clear all notifications error:", error);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      return response;
    } catch (error) {
      console.error("Get unread count error:", error);
      throw error;
    }
  },
};

export default notificationService;
