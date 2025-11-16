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
        customerName: "Nguyễn Văn An",
        customerAvatar: "https://i.pravatar.cc/150?img=1",
        lastMessage: "Sản phẩm này còn hàng không ạ? Tôi muốn đặt 2 cái",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        lastActiveTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 1,
        isOnline: true,
      },
      {
        id: 2,
        customerId: 102,
        customerName: "Trần Thị Bình",
        customerAvatar: "https://i.pravatar.cc/150?img=2",
        lastMessage: "Cảm ơn shop đã hỗ trợ! Sản phẩm rất tốt ạ",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        lastActiveTime: new Date(Date.now() - 1000 * 60 * 30),
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 3,
        customerId: 103,
        customerName: "Lê Hoàng Cường",
        customerAvatar: "https://i.pravatar.cc/150?img=3",
        lastMessage: "Khi nào shop giao hàng vậy?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        lastActiveTime: new Date(Date.now() - 1000 * 60 * 45),
        unreadCount: 1,
        isOnline: true,
      },
      {
        id: 4,
        customerId: 104,
        customerName: "Phạm Thị Duyên",
        customerAvatar: "https://i.pravatar.cc/150?img=4",
        lastMessage: "Shop có chương trình giảm giá không?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        lastActiveTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 2,
        isOnline: false,
      },
      {
        id: 5,
        customerId: 105,
        customerName: "Hoàng Văn Em",
        customerAvatar: "https://i.pravatar.cc/150?img=5",
        lastMessage: "Đơn hàng của tôi đã được xử lý chưa ạ?",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        lastActiveTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: 6,
        customerId: 106,
        customerName: "Vũ Thị Phương",
        customerAvatar: "https://i.pravatar.cc/150?img=6",
        lastMessage: "Tôi muốn đổi trả sản phẩm",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        lastActiveTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
        unreadCount: 1,
        isOnline: true,
      },
    ],
  }),

  getMockMessages: (conversationId) => {
    const mockMessages = {
      1: [
        {
          id: 1,
          senderId: 101,
          senderName: "Nguyễn Văn An",
          content: "Xin chào shop! Tôi muốn hỏi về sản phẩm áo thun này",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          isRead: true,
          type: "text",
        },
        {
          id: 2,
          senderId: "seller",
          senderName: "Shop",
          content:
            "Chào bạn! Tôi có thể hỗ trợ bạn. Bạn muốn hỏi gì về sản phẩm này?",
          timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
          isRead: true,
          type: "text",
        },
        {
          id: 3,
          senderId: 101,
          senderName: "Nguyễn Văn An",
          content: "Sản phẩm này còn size M không ạ? Và chất liệu như thế nào?",
          timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
          isRead: true,
          type: "text",
        },
        {
          id: 4,
          senderId: "seller",
          senderName: "Shop",
          content:
            "Size M vẫn còn hàng bạn nhé! Chất liệu cotton 100%, mát mẻ và thấm hút mồ hôi tốt",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          isRead: true,
          type: "text",
        },
        {
          id: 5,
          senderId: 101,
          senderName: "Nguyễn Văn An",
          content: "Vậy tôi đặt 2 cái size M nhé. Shop có freeship không ạ?",
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          isRead: true,
          type: "text",
        },
        {
          id: 6,
          senderId: "seller",
          senderName: "Shop",
          content:
            "Đơn hàng từ 200k trở lên được freeship bạn nhé. 2 áo thun = 300k, bạn được miễn phí ship!",
          timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
          isRead: true,
          type: "text",
        },
        {
          id: 7,
          senderId: 101,
          senderName: "Nguyễn Văn An",
          content: "Sản phẩm này còn hàng không ạ? Tôi muốn đặt 2 cái",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          isRead: false,
          type: "text",
        },
      ],
      2: [
        {
          id: 8,
          senderId: 102,
          senderName: "Trần Thị Bình",
          content: "Shop ơi, tôi đã nhận được hàng rồi",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isRead: true,
          type: "text",
        },
        {
          id: 9,
          senderId: "seller",
          senderName: "Shop",
          content: "Cảm ơn bạn! Chất lượng sản phẩm thế nào ạ?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
          isRead: true,
          type: "text",
        },
        {
          id: 10,
          senderId: 102,
          senderName: "Trần Thị Bình",
          content: "Cảm ơn shop đã hỗ trợ! Sản phẩm rất tốt ạ",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: true,
          type: "text",
        },
      ],
      3: [
        {
          id: 11,
          senderId: 103,
          senderName: "Lê Hoàng Cường",
          content:
            "Tôi đã đặt hàng từ 2 ngày trước, khi nào shop giao hàng vậy?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          isRead: false,
          type: "text",
        },
      ],
      4: [
        {
          id: 12,
          senderId: 104,
          senderName: "Phạm Thị Duyên",
          content:
            "Shop có chương trình giảm giá không? Tôi muốn mua nhiều sản phẩm",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          isRead: false,
          type: "text",
        },
        {
          id: 13,
          senderId: 104,
          senderName: "Phạm Thị Duyên",
          content: "Đặc biệt là các sản phẩm áo khoác và giày dép",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8), // 1.8 hours ago
          isRead: false,
          type: "text",
        },
      ],
      5: [
        {
          id: 14,
          senderId: 105,
          senderName: "Hoàng Văn Em",
          content: "Đơn hàng của tôi đã được xử lý chưa ạ? Mã đơn DH001234",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          isRead: true,
          type: "text",
        },
      ],
      6: [
        {
          id: 15,
          senderId: 106,
          senderName: "Vũ Thị Phương",
          content: "Tôi muốn đổi trả sản phẩm vì không vừa size",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          isRead: false,
          type: "text",
        },
      ],
    };

    return {
      success: true,
      data: mockMessages[conversationId] || [],
    };
  },
};
