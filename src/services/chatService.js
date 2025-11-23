import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class ChatService {
  // Tạo hội thoại mới
  static async createConversation(sellerId) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.ID_NguoiDung;

      if (!token || !userId) {
        throw new Error("No authentication token or user ID found");
      }

      console.log(
        `[CHAT_SERVICE] Creating conversation with seller ${sellerId}`
      );

      const response = await axios.post(
        `${API_BASE_URL}/chat/conversations`,
        { sellerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`[CHAT_SERVICE] ✅ Conversation created:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error creating conversation:", error);
      throw error;
    }
  }

  // Lấy danh sách hội thoại
  static async getConversations() {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.ID_NguoiDung;
      const userRole = user.LoaiNguoiDung || user.userType || "buyer";

      if (!token || !userId) {
        throw new Error("No authentication token or user ID found");
      }

      console.log(`[CHAT_SERVICE] Getting conversations for ${userRole}`);

      const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": userId,
          "x-user-role": userRole,
        },
      });

      console.log(`[CHAT_SERVICE] ✅ Got conversations:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error getting conversations:", error);
      throw error;
    }
  }

  // Lấy tin nhắn của một hội thoại
  static async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.ID_NguoiDung;

      if (!token || !userId) {
        throw new Error("No authentication token or user ID found");
      }

      console.log(
        `[CHAT_SERVICE] Getting messages for conversation ${conversationId}`
      );

      const response = await axios.get(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );

      console.log(`[CHAT_SERVICE] ✅ Got messages:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error getting messages:", error);
      throw error;
    }
  }

  // Gửi tin nhắn
  static async sendMessage(conversationId, content) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.ID_NguoiDung;

      if (!token || !userId) {
        throw new Error("No authentication token or user ID found");
      }

      console.log(
        `[CHAT_SERVICE] Sending message to conversation ${conversationId}`
      );

      const response = await axios.post(
        `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`[CHAT_SERVICE] ✅ Message sent:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error sending message:", error);
      throw error;
    }
  }

  // Gửi ảnh
  static async sendImage(conversationId, imageFile) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.ID_NguoiDung;

      if (!token || !userId) {
        throw new Error("No authentication token or user ID found");
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      console.log(
        `[CHAT_SERVICE] Sending image to conversation ${conversationId}`
      );

      const response = await axios.post(
        `${API_BASE_URL}/chat/conversations/${conversationId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`[CHAT_SERVICE] ✅ Image sent:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error sending image:", error);
      throw error;
    }
  }

  // Đánh dấu tin nhắn đã đọc
  static async markAsRead(conversationId) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.ID_NguoiDung;

      if (!token || !userId) {
        throw new Error("No authentication token or user ID found");
      }

      console.log(
        `[CHAT_SERVICE] Marking conversation ${conversationId} as read`
      );

      const response = await axios.put(
        `${API_BASE_URL}/chat/conversations/${conversationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );

      console.log(`[CHAT_SERVICE] ✅ Marked as read:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error marking as read:", error);
      throw error;
    }
  }

  // Lấy trạng thái online của user
  static async getUserStatus(userId) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${API_BASE_URL}/chat/users/${userId}/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("[CHAT_SERVICE] ❌ Error getting user status:", error);
      throw error;
    }
  }

  // Helper methods
  static formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

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

  static formatConversationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return minutes <= 0 ? "Vừa xong" : `${minutes} phút`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} giờ`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} ngày`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  }
}

export default ChatService;
