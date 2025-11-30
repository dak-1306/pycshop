import smartDB from "../../db/index.js";

class ChatModel {
  // Tạo hội thoại mới giữa buyer và seller
  static async createConversation(buyerId, sellerId) {
    try {
      console.log(
        `[CHAT_MODEL] Creating conversation between buyer ${buyerId} and seller ${sellerId}`
      );

      // Kiểm tra xem đã có hội thoại giữa 2 người này chưa
      const [existingRows] = await smartDB.executeRead(
        `SELECT ID_HoiThoai FROM hoithoai 
         WHERE ID_NguoiMua = ? AND ID_NguoiBan = ?`,
        [buyerId, sellerId]
      );

      if (existingRows.length > 0) {
        console.log(
          `[CHAT_MODEL] Conversation already exists with ID: ${existingRows[0].ID_HoiThoai}`
        );
        return {
          success: true,
          conversationId: existingRows[0].ID_HoiThoai,
          message: "Conversation already exists",
        };
      }

      // Tạo hội thoại mới
      const [result] = await smartDB.executeWrite(
        `INSERT INTO hoithoai (ID_NguoiMua, ID_NguoiBan, ThoiGianTao) 
         VALUES (?, ?, NOW())`,
        [buyerId, sellerId]
      );

      console.log(
        `[CHAT_MODEL] Created new conversation with ID: ${result.insertId}`
      );

      return {
        success: true,
        conversationId: result.insertId,
        message: "Conversation created successfully",
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error creating conversation:", error);
      throw error;
    }
  }

  // Lấy danh sách hội thoại của user
  static async getUserConversations(userId, userRole, context = null) {
    try {
      console.log(
        `[CHAT_MODEL] Getting conversations for user ${userId} with role ${userRole} in context ${context || 'auto'}`
      );

      let query, params;

      if (context === 'seller') {
        // Seller interface: Show only conversations where user is seller
        query = `
          SELECT 
            ht.ID_HoiThoai as conversationId,
            ht.ID_NguoiMua as partnerId,
            nd.HoTen as partnerName,
            nd.AvatarUrl as partnerAvatar,
            ht.ThoiGianTao as createdAt,
            'seller' as userRoleInConversation,
            (SELECT NoiDung FROM tinnhan 
             WHERE ID_HoiThoai = ht.ID_HoiThoai 
             ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessage,
            (SELECT ThoiGianGui FROM tinnhan 
             WHERE ID_HoiThoai = ht.ID_HoiThoai 
             ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessageTime,
            (SELECT COUNT(*) FROM tinnhan 
             WHERE ID_HoiThoai = ht.ID_HoiThoai 
             AND ID_NguoiGui != ? AND DaXem = 0) as unreadCount
          FROM hoithoai ht
          LEFT JOIN nguoidung nd ON ht.ID_NguoiMua = nd.ID_NguoiDung
          WHERE ht.ID_NguoiBan = ?
          ORDER BY lastMessageTime DESC, createdAt DESC
        `;
        params = [userId, userId];
      } else if (context === 'buyer') {
        // Buyer interface: Show only conversations where user is buyer
        query = `
          SELECT 
            ht.ID_HoiThoai as conversationId,
            ht.ID_NguoiBan as partnerId,
            nd.HoTen as partnerName,
            nd.AvatarUrl as partnerAvatar,
            ht.ThoiGianTao as createdAt,
            'buyer' as userRoleInConversation,
            (SELECT NoiDung FROM tinnhan 
             WHERE ID_HoiThoai = ht.ID_HoiThoai 
             ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessage,
            (SELECT ThoiGianGui FROM tinnhan 
             WHERE ID_HoiThoai = ht.ID_HoiThoai 
             ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessageTime,
            (SELECT COUNT(*) FROM tinnhan 
             WHERE ID_HoiThoai = ht.ID_HoiThoai 
             AND ID_NguoiGui != ? AND DaXem = 0) as unreadCount
          FROM hoithoai ht
          LEFT JOIN nguoidung nd ON ht.ID_NguoiBan = nd.ID_NguoiDung
          WHERE ht.ID_NguoiMua = ?
          ORDER BY lastMessageTime DESC, createdAt DESC
        `;
        params = [userId, userId];
      } else {
        // Legacy/Auto mode: Show all conversations (for backward compatibility)
        query = `
          (
            SELECT 
              ht.ID_HoiThoai as conversationId,
              ht.ID_NguoiBan as partnerId,
              nd.HoTen as partnerName,
              nd.AvatarUrl as partnerAvatar,
              ht.ThoiGianTao as createdAt,
              'buyer' as userRoleInConversation,
              (SELECT NoiDung FROM tinnhan 
               WHERE ID_HoiThoai = ht.ID_HoiThoai 
               ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessage,
              (SELECT ThoiGianGui FROM tinnhan 
               WHERE ID_HoiThoai = ht.ID_HoiThoai 
               ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessageTime,
              (SELECT COUNT(*) FROM tinnhan 
               WHERE ID_HoiThoai = ht.ID_HoiThoai 
               AND ID_NguoiGui != ? AND DaXem = 0) as unreadCount
            FROM hoithoai ht
            LEFT JOIN nguoidung nd ON ht.ID_NguoiBan = nd.ID_NguoiDung
            WHERE ht.ID_NguoiMua = ?
          )
          UNION
          (
            SELECT 
              ht.ID_HoiThoai as conversationId,
              ht.ID_NguoiMua as partnerId,
              nd.HoTen as partnerName,
              nd.AvatarUrl as partnerAvatar,
              ht.ThoiGianTao as createdAt,
              'seller' as userRoleInConversation,
              (SELECT NoiDung FROM tinnhan 
               WHERE ID_HoiThoai = ht.ID_HoiThoai 
               ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessage,
              (SELECT ThoiGianGui FROM tinnhan 
               WHERE ID_HoiThoai = ht.ID_HoiThoai 
               ORDER BY ThoiGianGui DESC LIMIT 1) as lastMessageTime,
              (SELECT COUNT(*) FROM tinnhan 
               WHERE ID_HoiThoai = ht.ID_HoiThoai 
               AND ID_NguoiGui != ? AND DaXem = 0) as unreadCount
            FROM hoithoai ht
            LEFT JOIN nguoidung nd ON ht.ID_NguoiMua = nd.ID_NguoiDung
            WHERE ht.ID_NguoiBan = ?
          )
          ORDER BY lastMessageTime DESC, createdAt DESC
        `;
        params = [userId, userId, userId, userId];
      }

      const [rows] = await smartDB.executeRead(query, params);

      console.log(
        `[CHAT_MODEL] Found ${rows.length} conversations for user ${userId}`
      );

      return {
        success: true,
        conversations: rows.map((row) => ({
          conversationId: row.conversationId,
          partnerId: row.partnerId,
          partnerName: row.partnerName,
          partnerAvatar: row.partnerAvatar,
          createdAt: row.createdAt,
          lastMessage: row.lastMessage,
          lastMessageTime: row.lastMessageTime,
          unreadCount: parseInt(row.unreadCount) || 0,
          userRoleInConversation: row.userRoleInConversation, // 'buyer' or 'seller'
        })),
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error getting user conversations:", error);
      throw error;
    }
  }

  // Gửi tin nhắn text
  static async sendMessage(conversationId, senderId, content) {
    try {
      console.log(
        `[CHAT_MODEL] Sending message to conversation ${conversationId} from user ${senderId}`
      );

      const [result] = await smartDB.executeWrite(
        `INSERT INTO tinnhan (ID_HoiThoai, ID_NguoiGui, NoiDung, ThoiGianGui, DaXem) 
         VALUES (?, ?, ?, NOW(), 0)`,
        [conversationId, senderId, content]
      );

      console.log(`[CHAT_MODEL] Message sent with ID: ${result.insertId}`);

      // Lấy thông tin tin nhắn vừa gửi
      const [messageRows] = await smartDB.executeRead(
        `SELECT 
          tn.ID_TinNhan as messageId,
          tn.ID_HoiThoai as conversationId,
          tn.ID_NguoiGui as senderId,
          tn.NoiDung as content,
          tn.ThoiGianGui as sentAt,
          tn.DaXem as isRead,
          nd.HoTen as senderName,
          nd.AvatarUrl as senderAvatar
         FROM tinnhan tn
         LEFT JOIN nguoidung nd ON tn.ID_NguoiGui = nd.ID_NguoiDung
         WHERE tn.ID_TinNhan = ?`,
        [result.insertId]
      );

      return {
        success: true,
        message: messageRows[0],
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error sending message:", error);
      throw error;
    }
  }

  // Gửi tin nhắn ảnh
  static async sendImageMessage(conversationId, senderId, imageUrl) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();

      console.log(
        `[CHAT_MODEL] Sending image message to conversation ${conversationId} from user ${senderId}`
      );

      // Tạo tin nhắn text với placeholder
      const [messageResult] = await connection.execute(
        `INSERT INTO tinnhan (ID_HoiThoai, ID_NguoiGui, NoiDung, ThoiGianGui, DaXem) 
         VALUES (?, ?, '[Hình ảnh]', NOW(), 0)`,
        [conversationId, senderId]
      );

      const messageId = messageResult.insertId;

      // Tạo record trong bảng tinnhananh
      await connection.execute(
        `INSERT INTO tinnhananh (ID_TinNhan, ID_NguoiGui, AnhUrl, ThoiGianGui) 
         VALUES (?, ?, ?, NOW())`,
        [messageId, senderId, imageUrl]
      );

      await connection.commit();

      console.log(`[CHAT_MODEL] Image message sent with ID: ${messageId}`);

      // Lấy thông tin tin nhắn vừa gửi
      const [messageRows] = await smartDB.executeRead(
        `SELECT 
          tn.ID_TinNhan as messageId,
          tn.ID_HoiThoai as conversationId,
          tn.ID_NguoiGui as senderId,
          tn.NoiDung as content,
          tn.ThoiGianGui as sentAt,
          tn.DaXem as isRead,
          nd.HoTen as senderName,
          nd.AvatarUrl as senderAvatar,
          tna.AnhUrl as imageUrl
         FROM tinnhan tn
         LEFT JOIN nguoidung nd ON tn.ID_NguoiGui = nd.ID_NguoiDung
         LEFT JOIN tinnhananh tna ON tn.ID_TinNhan = tna.ID_TinNhan
         WHERE tn.ID_TinNhan = ?`,
        [messageId]
      );

      return {
        success: true,
        message: {
          ...messageRows[0],
          type: "image",
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("[CHAT_MODEL] Error sending image message:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy tin nhắn trong hội thoại
  static async getConversationMessages(conversationId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;

      console.log(
        `[CHAT_MODEL] Getting messages for conversation ${conversationId}, page ${page}`
      );

      const [rows] = await smartDB.executeRead(
        `SELECT 
          tn.ID_TinNhan as messageId,
          tn.ID_HoiThoai as conversationId,
          tn.ID_NguoiGui as senderId,
          tn.NoiDung as content,
          tn.ThoiGianGui as sentAt,
          tn.DaXem as isRead,
          nd.HoTen as senderName,
          nd.AvatarUrl as senderAvatar,
          tna.AnhUrl as imageUrl,
          CASE WHEN tna.ID_TinNhan IS NOT NULL THEN 'image' ELSE 'text' END as type
         FROM tinnhan tn
         LEFT JOIN nguoidung nd ON tn.ID_NguoiGui = nd.ID_NguoiDung
         LEFT JOIN tinnhananh tna ON tn.ID_TinNhan = tna.ID_TinNhan
         WHERE tn.ID_HoiThoai = ?
         ORDER BY tn.ThoiGianGui DESC
         LIMIT ? OFFSET ?`,
        [conversationId, limit, offset]
      );

      // Đếm tổng số tin nhắn
      const [countRows] = await smartDB.executeRead(
        `SELECT COUNT(*) as total FROM tinnhan WHERE ID_HoiThoai = ?`,
        [conversationId]
      );

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      console.log(
        `[CHAT_MODEL] Found ${rows.length} messages for conversation ${conversationId}`
      );

      return {
        success: true,
        messages: rows.reverse(), // Reverse để tin nhắn cũ nhất ở đầu
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error getting conversation messages:", error);
      throw error;
    }
  }

  // Đánh dấu tin nhắn đã đọc
  static async markMessagesAsRead(conversationId, userId) {
    try {
      console.log(
        `[CHAT_MODEL] Marking messages as read for conversation ${conversationId} by user ${userId}`
      );

      const [result] = await smartDB.executeWrite(
        `UPDATE tinnhan 
         SET DaXem = 1 
         WHERE ID_HoiThoai = ? AND ID_NguoiGui != ? AND DaXem = 0`,
        [conversationId, userId]
      );

      console.log(
        `[CHAT_MODEL] Marked ${result.affectedRows} messages as read`
      );

      return {
        success: true,
        markedCount: result.affectedRows,
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error marking messages as read:", error);
      throw error;
    }
  }

  // Gửi tin nhắn mẫu khi có đơn hàng mới
  static async sendOrderWelcomeMessage(buyerId, sellerId, orderId) {
    try {
      console.log(
        `[CHAT_MODEL] Sending order welcome message for order ${orderId}`
      );

      // Tạo hội thoại nếu chưa có
      const conversationResult = await this.createConversation(
        buyerId,
        sellerId
      );

      if (!conversationResult.success) {
        throw new Error("Failed to create conversation");
      }

      const conversationId = conversationResult.conversationId;

      // Nội dung tin nhắn mẫu
      const welcomeMessage = `Cảm ơn bạn đã tin tưởng và mua hàng của chúng tôi! 

🎉 Đơn hàng #${orderId} của bạn đã được xác nhận thành công.

📦 Đơn hàng sẽ sớm được chuyển cho bộ phận giao hàng và bạn sẽ nhận được thông báo cập nhật trạng thái.

💬 Nếu có bất kỳ thắc mắc nào, đừng ngại liên hệ với chúng tôi qua chat này.

Cảm ơn bạn đã lựa chọn sản phẩm của chúng tôi! 🙏`;

      // Gửi tin nhắn từ seller
      const messageResult = await this.sendMessage(
        conversationId,
        sellerId,
        welcomeMessage
      );

      return {
        success: true,
        conversationId,
        message: messageResult.message,
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error sending order welcome message:", error);
      throw error;
    }
  }

  // Gửi tin nhắn cập nhật trạng thái đơn hàng
  static async sendOrderStatusMessage(buyerId, sellerId, orderId, status) {
    try {
      console.log(
        `[CHAT_MODEL] Sending order status message for order ${orderId}, status: ${status}`
      );

      // Tìm hội thoại giữa buyer và seller
      const [conversationRows] = await smartDB.executeRead(
        `SELECT ID_HoiThoai FROM hoithoai 
         WHERE ID_NguoiMua = ? AND ID_NguoiBan = ?`,
        [buyerId, sellerId]
      );

      if (conversationRows.length === 0) {
        console.log("No conversation found, creating new one");
        const conversationResult = await this.createConversation(
          buyerId,
          sellerId
        );
        if (!conversationResult.success) {
          throw new Error("Failed to create conversation");
        }
      }

      const conversationId =
        conversationRows[0]?.ID_HoiThoai ||
        (await this.createConversation(buyerId, sellerId)).conversationId;

      // Nội dung tin nhắn theo trạng thái
      let statusMessage = "";
      switch (status) {
        case "confirmed":
          statusMessage = `✅ Đơn hàng #${orderId} đã được xác nhận và đang chuẩn bị hàng.`;
          break;
        case "shipping":
          statusMessage = `🚚 Đơn hàng #${orderId} đã được giao cho đơn vị vận chuyển và đang trên đường đến bạn.`;
          break;
        case "delivered":
          statusMessage = `📦 Đơn hàng #${orderId} đã được giao thành công! Cảm ơn bạn đã mua hàng của chúng tôi.`;
          break;
        case "cancelled":
          statusMessage = `❌ Đơn hàng #${orderId} đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.`;
          break;
        default:
          statusMessage = `📋 Đơn hàng #${orderId} đã được cập nhật trạng thái: ${status}`;
      }

      // Gửi tin nhắn từ seller
      const messageResult = await this.sendMessage(
        conversationId,
        sellerId,
        statusMessage
      );

      return {
        success: true,
        conversationId,
        message: messageResult.message,
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error sending order status message:", error);
      throw error;
    }
  }

  // Lấy thống kê chat
  static async getChatStatistics(userId, userRole) {
    try {
      console.log(
        `[CHAT_MODEL] Getting chat statistics for user ${userId} with role ${userRole}`
      );

      let query, params;

      if (userRole === "buyer") {
        query = `
          SELECT 
            COUNT(DISTINCT ht.ID_HoiThoai) as totalConversations,
            COUNT(tn.ID_TinNhan) as totalMessages,
            COUNT(CASE WHEN tn.DaXem = 0 AND tn.ID_NguoiGui != ? THEN 1 END) as unreadMessages
          FROM hoithoai ht
          LEFT JOIN tinnhan tn ON ht.ID_HoiThoai = tn.ID_HoiThoai
          WHERE ht.ID_NguoiMua = ?
        `;
        params = [userId, userId];
      } else {
        query = `
          SELECT 
            COUNT(DISTINCT ht.ID_HoiThoai) as totalConversations,
            COUNT(tn.ID_TinNhan) as totalMessages,
            COUNT(CASE WHEN tn.DaXem = 0 AND tn.ID_NguoiGui != ? THEN 1 END) as unreadMessages
          FROM hoithoai ht
          LEFT JOIN tinnhan tn ON ht.ID_HoiThoai = tn.ID_HoiThoai
          WHERE ht.ID_NguoiBan = ?
        `;
        params = [userId, userId];
      }

      const [rows] = await smartDB.executeRead(query, params);

      return {
        success: true,
        statistics: {
          totalConversations: parseInt(rows[0].totalConversations) || 0,
          totalMessages: parseInt(rows[0].totalMessages) || 0,
          unreadMessages: parseInt(rows[0].unreadMessages) || 0,
        },
      };
    } catch (error) {
      console.error("[CHAT_MODEL] Error getting chat statistics:", error);
      throw error;
    }
  }
}

export default ChatModel;
