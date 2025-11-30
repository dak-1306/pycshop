import ChatModel from "../models/ChatModel.js";

class ChatController {
  // Tạo hội thoại mới
  static async createConversation(req, res) {
    try {
      const { sellerId } = req.body;
      const buyerId = req.headers["x-user-id"];

      if (!buyerId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!sellerId) {
        return res.status(400).json({
          success: false,
          message: "Seller ID is required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Creating conversation between buyer ${buyerId} and seller ${sellerId}`
      );

      const result = await ChatModel.createConversation(
        parseInt(buyerId),
        parseInt(sellerId)
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error creating conversation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create conversation",
        error: error.message,
      });
    }
  }

  // Lấy danh sách hội thoại
  static async getConversations(req, res) {
    try {
      const userId = req.headers["x-user-id"];
      const userRole = req.headers["x-user-role"];
      const context = req.query.context; // 'seller' hoặc 'buyer'

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Getting conversations for user ${userId} with role ${userRole} in context ${context}`
      );

      const result = await ChatModel.getUserConversations(
        parseInt(userId),
        userRole,
        context
      );

      res.json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error getting conversations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get conversations",
        error: error.message,
      });
    }
  }

  // Gửi tin nhắn text
  static async sendMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const { content } = req.body;
      const senderId = req.headers["x-user-id"];

      if (!senderId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!content || content.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Sending message to conversation ${conversationId}`
      );

      const result = await ChatModel.sendMessage(
        parseInt(conversationId),
        parseInt(senderId),
        content.trim()
      );

      // Emit socket event (will be handled by socket handler)
      req.app
        .get("io")
        ?.to(`conversation_${conversationId}`)
        .emit("new_message", {
          ...result.message,
          conversationId: parseInt(conversationId),
        });

      res.status(201).json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error sending message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message",
        error: error.message,
      });
    }
  }

  // Gửi tin nhắn ảnh
  static async sendImageMessage(req, res) {
    try {
      const { conversationId } = req.params;
      const senderId = req.headers["x-user-id"];

      if (!senderId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Sending image message to conversation ${conversationId}`
      );

      // Tạo URL cho ảnh
      const imageUrl = `/uploads/chat/${req.file.filename}`;

      const result = await ChatModel.sendImageMessage(
        parseInt(conversationId),
        parseInt(senderId),
        imageUrl
      );

      // Emit socket event
      req.app
        .get("io")
        ?.to(`conversation_${conversationId}`)
        .emit("new_message", {
          ...result.message,
          conversationId: parseInt(conversationId),
        });

      res.status(201).json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error sending image message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send image message",
        error: error.message,
      });
    }
  }

  // Lấy tin nhắn trong hội thoại
  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const userId = req.headers["x-user-id"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Getting messages for conversation ${conversationId}, page ${page}`
      );

      const result = await ChatModel.getConversationMessages(
        parseInt(conversationId),
        page,
        limit
      );

      res.json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error getting messages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get messages",
        error: error.message,
      });
    }
  }

  // Đánh dấu tin nhắn đã đọc
  static async markAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.headers["x-user-id"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Marking messages as read for conversation ${conversationId}`
      );

      const result = await ChatModel.markMessagesAsRead(
        parseInt(conversationId),
        parseInt(userId)
      );

      // Emit socket event to update unread count
      req.app
        .get("io")
        ?.to(`user_${userId}`)
        .emit("messages_read", {
          conversationId: parseInt(conversationId),
          markedCount: result.markedCount,
        });

      res.json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error marking messages as read:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark messages as read",
        error: error.message,
      });
    }
  }

  // Gửi tin nhắn chào mừng khi có đơn hàng mới (API internal)
  static async sendOrderWelcomeMessage(req, res) {
    try {
      const { buyerId, sellerId, orderId } = req.body;

      if (!buyerId || !sellerId || !orderId) {
        return res.status(400).json({
          success: false,
          message: "buyerId, sellerId, and orderId are required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Sending order welcome message for order ${orderId}`
      );

      const result = await ChatModel.sendOrderWelcomeMessage(
        parseInt(buyerId),
        parseInt(sellerId),
        orderId
      );

      // Emit socket events
      const io = req.app.get("io");
      if (io) {
        // Thông báo cho buyer
        io.to(`user_${buyerId}`).emit("new_message", {
          ...result.message,
          conversationId: result.conversationId,
        });

        // Cập nhật danh sách hội thoại
        io.to(`user_${buyerId}`).emit("conversation_updated", {
          conversationId: result.conversationId,
        });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error(
        "[CHAT_CONTROLLER] Error sending order welcome message:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Failed to send order welcome message",
        error: error.message,
      });
    }
  }

  // Gửi tin nhắn cập nhật trạng thái đơn hàng (API internal)
  static async sendOrderStatusMessage(req, res) {
    try {
      const { buyerId, sellerId, orderId, status } = req.body;

      if (!buyerId || !sellerId || !orderId || !status) {
        return res.status(400).json({
          success: false,
          message: "buyerId, sellerId, orderId, and status are required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Sending order status message for order ${orderId}, status: ${status}`
      );

      const result = await ChatModel.sendOrderStatusMessage(
        parseInt(buyerId),
        parseInt(sellerId),
        orderId,
        status
      );

      // Emit socket events
      const io = req.app.get("io");
      if (io) {
        // Thông báo cho buyer
        io.to(`user_${buyerId}`).emit("new_message", {
          ...result.message,
          conversationId: result.conversationId,
        });

        // Cập nhật danh sách hội thoại
        io.to(`user_${buyerId}`).emit("conversation_updated", {
          conversationId: result.conversationId,
        });
      }

      res.status(201).json(result);
    } catch (error) {
      console.error(
        "[CHAT_CONTROLLER] Error sending order status message:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Failed to send order status message",
        error: error.message,
      });
    }
  }

  // Lấy thống kê chat
  static async getStatistics(req, res) {
    try {
      const userId = req.headers["x-user-id"];
      const userRole = req.headers["x-user-role"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      console.log(
        `[CHAT_CONTROLLER] Getting chat statistics for user ${userId}`
      );

      const result = await ChatModel.getChatStatistics(
        parseInt(userId),
        userRole
      );

      res.json(result);
    } catch (error) {
      console.error("[CHAT_CONTROLLER] Error getting statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get chat statistics",
        error: error.message,
      });
    }
  }
}

export default ChatController;
