import smartDB from "../../db/index.js";

class NotificationModel {
  // Tạo thông báo mới
  static async createNotification(notificationData) {
    try {
      const {
        ID_NguoiNhan,
        Loai,
        NoiDung,
        VaiTro = "buyer", // Default to buyer if not specified
        ID_LienQuan = null,
      } = notificationData;

      console.log(
        `[NOTIFICATION_MODEL] Creating notification for user ${ID_NguoiNhan}, type: ${Loai}, role: ${VaiTro}`
      );

      const [result] = await smartDB.execute(
        `INSERT INTO thongbao (ID_NguoiNhan, Loai, VaiTro, NoiDung, ThoiGianGui)
         VALUES (?, ?, ?, ?, NOW())`,
        [ID_NguoiNhan, Loai, VaiTro, NoiDung]
      );

      console.log(
        `[NOTIFICATION_MODEL] Created notification ID: ${result.insertId}`
      );

      return {
        success: true,
        notificationId: result.insertId,
        message: "Thông báo đã được tạo thành công",
      };
    } catch (error) {
      console.error("[NOTIFICATION_MODEL] Error creating notification:", error);
      throw error;
    }
  }

  // Lấy danh sách thông báo của user
  static async getNotificationsByUser(
    userId,
    page = 1,
    limit = 20,
    type = null
  ) {
    try {
      const offset = (page - 1) * limit;

      console.log(`[NOTIFICATION_MODEL] 🔍 Query params:`, {
        userId,
        page,
        limit,
        type,
      });

      let query = `
        SELECT 
          ID_ThongBao as notificationId,
          ID_NguoiNhan as userId,
          Loai as type,
          VaiTro as recipientRole,
          NoiDung as content,
          ThoiGianGui as createdAt,
          DaDoc as isRead
        FROM thongbao 
        WHERE ID_NguoiNhan = ?
      `;

      const params = [userId];

      // Filter by type if specified
      if (type && type !== "all") {
        query += ` AND Loai = ?`;
        params.push(type);
      }

      query += ` ORDER BY ThoiGianGui DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      console.log(`[NOTIFICATION_MODEL] 📋 SQL Query:`, query);
      console.log(`[NOTIFICATION_MODEL] 📊 Params:`, params);

      const [notifications] = await smartDB.execute(query, params);

      // Get total count for pagination
      let countQuery = `SELECT COUNT(*) as total FROM thongbao WHERE ID_NguoiNhan = ?`;
      let countParams = [userId];

      if (type && type !== "all") {
        countQuery += ` AND Loai = ?`;
        countParams.push(type);
      }

      const [countResult] = await smartDB.execute(countQuery, countParams);
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      // Get unread count
      const [unreadResult] = await smartDB.execute(
        `SELECT COUNT(*) as unreadCount FROM thongbao WHERE ID_NguoiNhan = ? AND DaDoc = 0`,
        [userId]
      );
      const unreadCount = unreadResult[0].unreadCount;

      return {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          total: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        unreadCount,
      };
    } catch (error) {
      console.error("[NOTIFICATION_MODEL] Error getting notifications:", error);
      throw error;
    }
  }

  // Đánh dấu thông báo đã đọc
  static async markAsRead(notificationId, userId = null) {
    try {
      let query = `UPDATE thongbao SET DaDoc = 1 WHERE ID_ThongBao = ?`;
      const params = [notificationId];

      // Nếu có userId, chỉ update thông báo của user đó
      if (userId) {
        query += ` AND ID_NguoiNhan = ?`;
        params.push(userId);
      }

      const [result] = await smartDB.execute(query, params);

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: "Không tìm thấy thông báo hoặc bạn không có quyền cập nhật",
        };
      }

      console.log(
        `[NOTIFICATION_MODEL] Marked notification ${notificationId} as read`
      );

      return {
        success: true,
        message: "Đã đánh dấu thông báo là đã đọc",
      };
    } catch (error) {
      console.error(
        "[NOTIFICATION_MODEL] Error marking notification as read:",
        error
      );
      throw error;
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  static async markAllAsRead(userId) {
    try {
      const [result] = await smartDB.execute(
        `UPDATE thongbao SET DaDoc = 1 WHERE ID_NguoiNhan = ? AND DaDoc = 0`,
        [userId]
      );

      console.log(
        `[NOTIFICATION_MODEL] Marked ${result.affectedRows} notifications as read for user ${userId}`
      );

      return {
        success: true,
        message: `Đã đánh dấu ${result.affectedRows} thông báo là đã đọc`,
        updatedCount: result.affectedRows,
      };
    } catch (error) {
      console.error(
        "[NOTIFICATION_MODEL] Error marking all notifications as read:",
        error
      );
      throw error;
    }
  }

  // Xóa thông báo
  static async deleteNotification(notificationId, userId = null) {
    try {
      let query = `DELETE FROM thongbao WHERE ID_ThongBao = ?`;
      const params = [notificationId];

      // Nếu có userId, chỉ xóa thông báo của user đó
      if (userId) {
        query += ` AND ID_NguoiNhan = ?`;
        params.push(userId);
      }

      const [result] = await smartDB.execute(query, params);

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: "Không tìm thấy thông báo hoặc bạn không có quyền xóa",
        };
      }

      console.log(
        `[NOTIFICATION_MODEL] Deleted notification ${notificationId}`
      );

      return {
        success: true,
        message: "Đã xóa thông báo thành công",
      };
    } catch (error) {
      console.error("[NOTIFICATION_MODEL] Error deleting notification:", error);
      throw error;
    }
  }

  // Lấy số lượng thông báo chưa đọc
  static async getUnreadCount(userId) {
    try {
      const [result] = await smartDB.execute(
        `SELECT COUNT(*) as count FROM thongbao WHERE ID_NguoiNhan = ? AND DaDoc = 0`,
        [userId]
      );

      return {
        success: true,
        unreadCount: result[0].count,
      };
    } catch (error) {
      console.error("[NOTIFICATION_MODEL] Error getting unread count:", error);
      throw error;
    }
  }

  // Helper methods cho từng loại thông báo

  // Tạo thông báo đơn hàng
  static async createOrderNotification(userId, orderId, status, message) {
    return await this.createNotification({
      ID_NguoiNhan: userId,
      Loai: "order",
      NoiDung: message,
      ID_LienQuan: orderId,
    });
  }

  // Tạo thông báo thanh toán (sẽ dùng sau này)
  static async createPaymentNotification(userId, paymentId, message) {
    return await this.createNotification({
      ID_NguoiNhan: userId,
      Loai: "payment",
      NoiDung: message,
      ID_LienQuan: paymentId,
    });
  }

  // Tạo thông báo báo cáo (sẽ dùng sau này)
  static async createReportNotification(userId, reportId, message) {
    return await this.createNotification({
      ID_NguoiNhan: userId,
      Loai: "report",
      NoiDung: message,
      ID_LienQuan: reportId,
    });
  }
}

export default NotificationModel;
