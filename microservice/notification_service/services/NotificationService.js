import axios from "axios";

class NotificationService {
  constructor() {
    this.baseURL =
      process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5008";
  }

  // Tạo thông báo chung
  async createNotification(userId, type, content, relatedId = null) {
    try {
      const response = await axios.post(
        `${this.baseURL}/notifications/create`,
        {
          userId,
          type,
          content,
          relatedId,
        },
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        console.error(
          `[NOTIFICATION_SERVICE] ❌ Failed to create notification:`,
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        `[NOTIFICATION_SERVICE] ❌ Error creating notification:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to create notification",
        error: error.message,
      };
    }
  }

  // Tạo thông báo đơn hàng
  async createOrderNotification(userId, orderId, status, customMessage = null) {
    try {
      // Tạo message mặc định dựa trên status
      const defaultMessages = {
        pending: `Đơn hàng #${orderId} đang chờ xác nhận từ người bán`,
        confirmed: `Đơn hàng #${orderId} đã được xác nhận và đang chuẩn bị hàng`,
        shipped: `Đơn hàng #${orderId} đã được gửi đi và đang trên đường giao đến bạn`,
        delivered: `Đơn hàng #${orderId} đã được giao thành công. Cảm ơn bạn đã mua hàng!`,
        cancelled: `Đơn hàng #${orderId} đã bị hủy`,
      };

      const message =
        customMessage ||
        defaultMessages[status] ||
        `Đơn hàng #${orderId} đã được cập nhật trạng thái: ${status}`;

      const response = await axios.post(
        `${this.baseURL}/notifications/order`,
        {
          userId,
          orderId,
          status,
          message,
        },
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        console.error(
          `[NOTIFICATION_SERVICE] ❌ Failed to create order notification:`,
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        `[NOTIFICATION_SERVICE] ❌ Error creating order notification:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to create order notification",
        error: error.message,
      };
    }
  }

  // Tạo thông báo thanh toán (sẽ dùng sau này)
  async createPaymentNotification(
    userId,
    paymentId,
    status,
    amount,
    customMessage = null
  ) {
    try {
      const defaultMessages = {
        success: `Thanh toán ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)} đã thành công`,
        failed: `Thanh toán ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)} đã thất bại`,
        pending: `Thanh toán ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)} đang chờ xử lý`,
      };

      const message =
        customMessage ||
        defaultMessages[status] ||
        `Thanh toán có ID #${paymentId} đã được cập nhật`;

      return await this.createNotification(
        userId,
        "payment",
        message,
        paymentId
      );
    } catch (error) {
      console.error(
        `[NOTIFICATION_SERVICE] ❌ Error creating payment notification:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to create payment notification",
        error: error.message,
      };
    }
  }

  // Tạo thông báo báo cáo (sẽ dùng sau này)
  async createReportNotification(userId, reportId, type, customMessage = null) {
    try {
      const defaultMessages = {
        created: `Báo cáo #${reportId} đã được tạo thành công`,
        processed: `Báo cáo #${reportId} đã được xử lý`,
        rejected: `Báo cáo #${reportId} đã bị từ chối`,
      };

      const message =
        customMessage ||
        defaultMessages[type] ||
        `Báo cáo #${reportId} đã được cập nhật`;

      return await this.createNotification(userId, "report", message, reportId);
    } catch (error) {
      console.error(
        `[NOTIFICATION_SERVICE] ❌ Error creating report notification:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to create report notification",
        error: error.message,
      };
    }
  }

  // Kiểm tra service có hoạt động không
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/notifications/health`, {
        timeout: 3000,
      });
      return response.data.success;
    } catch (error) {
      console.error(
        `[NOTIFICATION_SERVICE] ❌ Health check failed:`,
        error.message
      );
      return false;
    }
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
