import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

class NotificationService {
  // Lấy danh sách thông báo
  static async getNotifications(page = 1, limit = 20, type = "all") {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(
        `[NOTIFICATION_SERVICE] Getting notifications - page: ${page}, limit: ${limit}, type: ${type}`
      );

      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        params: { page, limit, type },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        `[NOTIFICATION_SERVICE] ✅ Got notifications:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[NOTIFICATION_SERVICE] ❌ Error getting notifications:",
        error
      );
      throw error;
    }
  }

  // Lấy số lượng thông báo chưa đọc
  static async getUnreadCount() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(`[NOTIFICATION_SERVICE] Getting unread count`);

      const response = await axios.get(
        `${API_BASE_URL}/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`[NOTIFICATION_SERVICE] ✅ Got unread count:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        "[NOTIFICATION_SERVICE] ❌ Error getting unread count:",
        error
      );
      throw error;
    }
  }

  // Đánh dấu thông báo đã đọc
  static async markAsRead(notificationId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(
        `[NOTIFICATION_SERVICE] Marking notification ${notificationId} as read`
      );

      const response = await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        `[NOTIFICATION_SERVICE] ✅ Marked notification as read:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[NOTIFICATION_SERVICE] ❌ Error marking notification as read:",
        error
      );
      throw error;
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  static async markAllAsRead() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(`[NOTIFICATION_SERVICE] Marking all notifications as read`);

      const response = await axios.put(
        `${API_BASE_URL}/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        `[NOTIFICATION_SERVICE] ✅ Marked all notifications as read:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[NOTIFICATION_SERVICE] ❌ Error marking all notifications as read:",
        error
      );
      throw error;
    }
  }

  // Xóa thông báo
  static async deleteNotification(notificationId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(
        `[NOTIFICATION_SERVICE] Deleting notification ${notificationId}`
      );

      const response = await axios.delete(
        `${API_BASE_URL}/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        `[NOTIFICATION_SERVICE] ✅ Deleted notification:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        "[NOTIFICATION_SERVICE] ❌ Error deleting notification:",
        error
      );
      throw error;
    }
  }

  // Helper method để format thời gian thông báo
  static formatNotificationTime(timestamp) {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) {
      return "Vừa xong";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    }
  }

  // Helper method để lấy icon theo loại thông báo
  static getNotificationIcon(type) {
    const icons = {
      order: "shopping-cart",
      payment: "credit-card",
      report: "flag",
      system: "bell",
      promotion: "gift",
      inventory: "box",
      user: "user",
      product: "tag",
      review: "star",
      shipping: "truck",
    };
    return icons[type] || "bell";
  }

  // Helper method để lấy màu theo loại thông báo
  static getNotificationColor(type) {
    const colors = {
      order: "text-blue-600 bg-blue-100",
      payment: "text-green-600 bg-green-100",
      report: "text-red-600 bg-red-100",
      system: "text-gray-600 bg-gray-100",
      promotion: "text-purple-600 bg-purple-100",
      inventory: "text-orange-600 bg-orange-100",
      user: "text-indigo-600 bg-indigo-100",
      product: "text-yellow-600 bg-yellow-100",
      review: "text-pink-600 bg-pink-100",
      shipping: "text-cyan-600 bg-cyan-100",
    };
    return colors[type] || "text-gray-600 bg-gray-100";
  }
}

export default NotificationService;
