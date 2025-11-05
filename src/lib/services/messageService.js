import { api } from "./apiService";

export const messageService = {
  // Get all conversations for seller
  getConversations: async (sellerId) => {
    try {
      const response = await api.get(`/messages/conversations/${sellerId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Không thể tải tin nhắn",
      };
    }
  },

  // Get messages for specific conversation
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(
        `/messages/conversation/${conversationId}`
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return {
        success: false,
        error: error.message || "Không thể tải tin nhắn",
      };
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post(`/messages/send`, messageData);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        success: false,
        error: error.message || "Không thể gửi tin nhắn",
      };
    }
  },

  // Mark messages as read
  markAsRead: async (conversationId, userId) => {
    try {
      const response = await api.put(`/messages/mark-read`, {
        conversationId,
        userId,
      });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return {
        success: false,
        error: error.message || "Không thể cập nhật trạng thái tin nhắn",
      };
    }
  },

  // Mock data for development
  getMockConversations: () => ({
    success: true,
    data: [
      {
        id: 1,
        customerId: 101,
        customerName: "Nguyễn Văn A",
        customerAvatar: "/images/users/user1.jpg",
        lastMessage: "Sản phẩm này còn hàng không ạ?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: 2,
        customerId: 102,
        customerName: "Trần Thị B",
        customerAvatar: "/images/users/user2.jpg",
        lastMessage: "Cảm ơn shop đã hỗ trợ!",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 3,
        customerId: 103,
        customerName: "Lê Văn C",
        customerAvatar: "/images/users/user3.jpg",
        lastMessage: "Khi nào có hàng mới thông báo mình nhé",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 1,
        isOnline: true,
      },
    ],
  }),

  getMockMessages: (conversationId) => ({
    success: true,
    data: [
      {
        id: 1,
        conversationId: conversationId,
        senderId: 101,
        senderType: "customer",
        message: "Chào shop! Tôi muốn hỏi về sản phẩm iPhone 15",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true,
      },
      {
        id: 2,
        conversationId: conversationId,
        senderId: 1,
        senderType: "seller",
        message:
          "Chào bạn! Shop có sẵn iPhone 15 các màu. Bạn quan tâm màu nào ạ?",
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        isRead: true,
      },
      {
        id: 3,
        conversationId: conversationId,
        senderId: 101,
        senderType: "customer",
        message: "Màu đen 256GB còn không shop?",
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        isRead: true,
      },
      {
        id: 4,
        conversationId: conversationId,
        senderId: 1,
        senderType: "seller",
        message:
          "Còn ạ! Giá hiện tại là 29.990.000đ. Bạn có muốn đặt hàng không?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true,
      },
      {
        id: 5,
        conversationId: conversationId,
        senderId: 101,
        senderType: "customer",
        message: "Sản phẩm này còn hàng không ạ?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
      },
    ],
  }),
};
