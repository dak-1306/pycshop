import NotificationModel from "../models/NotificationModel.js";
import kafkaService from "../../shared/kafka/KafkaService.js";

class NotificationController {
  // Lấy danh sách thông báo của user
  static async getNotifications(req, res) {
    try {
      const userId = req.headers["x-user-id"] || req.user?.id;
      const { page = 1, limit = 20, type = "all" } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      const result = await NotificationModel.getNotificationsByUser(
        parseInt(userId),
        parseInt(page),
        parseInt(limit),
        type
      );

      res.json({
        success: true,
        data: result,
        message: "Lấy danh sách thông báo thành công",
      });
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error getting notifications:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách thông báo",
        error: error.message,
      });
    }
  }

  // Lấy số lượng thông báo chưa đọc
  static async getUnreadCount(req, res) {
    try {
      const userId = req.headers["x-user-id"] || req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      const result = await NotificationModel.getUnreadCount(parseInt(userId));

      res.json({
        success: true,
        data: { unreadCount: result.unreadCount },
        message: "Lấy số lượng thông báo chưa đọc thành công",
      });
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error getting unread count:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy số lượng thông báo chưa đọc",
        error: error.message,
      });
    }
  }

  // Đánh dấu thông báo đã đọc
  static async markAsRead(req, res) {
    try {
      const userId = req.headers["x-user-id"] || req.user?.id;
      const { notificationId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      const result = await NotificationModel.markAsRead(
        parseInt(notificationId),
        parseInt(userId)
      );

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error marking notification as read:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi đánh dấu thông báo đã đọc",
        error: error.message,
      });
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  static async markAllAsRead(req, res) {
    try {
      const userId = req.headers["x-user-id"] || req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      const result = await NotificationModel.markAllAsRead(parseInt(userId));

      res.json(result);
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error marking all notifications as read:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi đánh dấu tất cả thông báo đã đọc",
        error: error.message,
      });
    }
  }

  // Xóa thông báo
  static async deleteNotification(req, res) {
    try {
      const userId = req.headers["x-user-id"] || req.user?.id;
      const { notificationId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      const result = await NotificationModel.deleteNotification(
        parseInt(notificationId),
        parseInt(userId)
      );

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error deleting notification:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi xóa thông báo",
        error: error.message,
      });
    }
  }

  // Tạo thông báo mới (API internal - chỉ dành cho các service khác gọi)
  static async createNotification(req, res) {
    try {
      const { userId, type, content, relatedId = null } = req.body;

      if (!userId || !type || !content) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc (userId, type, content)",
        });
      }

      const result = await NotificationModel.createNotification({
        ID_NguoiNhan: userId,
        Loai: type,
        NoiDung: content,
        ID_LienQuan: relatedId,
      });

      // Send notification event to Kafka for real-time updates
      if (result.success && result.notification) {
        try {
          await kafkaService.sendNotificationEvent("NOTIFICATION_CREATED", {
            userId: userId,
            notification: result.notification,
          });
        } catch (kafkaError) {
          console.error(
            `[NOTIFICATION_CONTROLLER] Failed to send notification event to Kafka:`,
            kafkaError
          );
          // Don't fail the notification creation if Kafka fails
        }
      }

      res.status(201).json(result);
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error creating notification:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo thông báo",
        error: error.message,
      });
    }
  }

  // API để các service khác tạo thông báo đơn hàng
  static async createOrderNotification(req, res) {
    try {
      const { userId, orderId, status, message } = req.body;

      if (!userId || !orderId || !status || !message) {
        return res.status(400).json({
          success: false,
          message:
            "Thiếu thông tin bắt buộc (userId, orderId, status, message)",
        });
      }

      const result = await NotificationModel.createOrderNotification(
        userId,
        orderId,
        status,
        message
      );

      // Send notification event to Kafka for real-time updates
      if (result.success && result.notification) {
        try {
          await kafkaService.sendNotificationEvent("NOTIFICATION_CREATED", {
            userId: userId,
            notification: result.notification,
          });
        } catch (kafkaError) {
          console.error(
            `[NOTIFICATION_CONTROLLER] Failed to send notification event to Kafka:`,
            kafkaError
          );
          // Don't fail the notification creation if Kafka fails
        }
      }

      res.status(201).json(result);
    } catch (error) {
      console.error(
        "[NOTIFICATION_CONTROLLER] Error creating order notification:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo thông báo đơn hàng",
        error: error.message,
      });
    }
  }

  // Health check
  static async healthCheck(req, res) {
    try {
      res.json({
        success: true,
        message: "Notification Service is running",
        timestamp: new Date().toISOString(),
        service: "notification_service",
        version: "1.0.0",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Service unavailable",
        error: error.message,
      });
    }
  }
}

export default NotificationController;
