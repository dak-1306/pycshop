import axios from "axios";

class NotificationHelper {
  constructor() {
    this.baseURL =
      process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5008";
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

      console.log(
        `[NOTIFICATION_HELPER] Creating order notification for user ${userId}, order ${orderId}, status: ${status}`
      );

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
        console.log(
          `[NOTIFICATION_HELPER] ✅ Order notification created successfully`
        );
        return response.data;
      } else {
        console.error(
          `[NOTIFICATION_HELPER] ❌ Failed to create order notification:`,
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        `[NOTIFICATION_HELPER] ❌ Error creating order notification:`,
        error.message
      );
      // Don't throw error to avoid breaking the main flow
      return {
        success: false,
        message: "Failed to create order notification",
        error: error.message,
      };
    }
  }

  // Tạo thông báo cho người bán khi có đơn hàng mới
  async createSellerNotification(
    sellerId,
    orderId,
    buyerName = null,
    customMessage = null
  ) {
    try {
      const message =
        customMessage ||
        `Bạn có đơn hàng mới #${orderId}${
          buyerName ? ` từ khách hàng ${buyerName}` : ""
        }. Vui lòng xác nhận đơn hàng.`;

      console.log(
        `[NOTIFICATION_HELPER] Creating seller notification for seller ${sellerId}, order ${orderId}`
      );

      const response = await axios.post(
        `${this.baseURL}/notifications/create`,
        {
          userId: sellerId,
          type: "order",
          content: message,
          relatedId: orderId,
        },
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log(
          `[NOTIFICATION_HELPER] ✅ Seller notification created successfully`
        );
        return response.data;
      } else {
        console.error(
          `[NOTIFICATION_HELPER] ❌ Failed to create seller notification:`,
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        `[NOTIFICATION_HELPER] ❌ Error creating seller notification:`,
        error.message
      );
      return {
        success: false,
        message: "Failed to create seller notification",
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
        `[NOTIFICATION_HELPER] ❌ Health check failed:`,
        error.message
      );
      return false;
    }
  }
}

// Export singleton instance
const notificationHelper = new NotificationHelper();
export default notificationHelper;
