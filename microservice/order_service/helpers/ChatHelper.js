import axios from "axios";

class ChatHelper {
  constructor() {
    this.baseURL = process.env.CHAT_SERVICE_URL || "http://localhost:5011";
  }

  // Gửi tin nhắn chào mừng khi có đơn hàng mới
  async sendOrderWelcomeMessage(buyerId, sellerId, orderId) {
    try {
      console.log(
        `[CHAT_HELPER] Sending order welcome message for order ${orderId}`
      );

      const response = await axios.post(
        `${this.baseURL}/api/chat/internal/order-welcome`,
        {
          buyerId,
          sellerId,
          orderId,
        },
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log(`[CHAT_HELPER] ✅ Order welcome message sent successfully`);
        return response.data;
      } else {
        console.error(
          `[CHAT_HELPER] ❌ Failed to send order welcome message:`,
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        `[CHAT_HELPER] ❌ Error sending order welcome message:`,
        error.message
      );
      // Don't throw error to avoid breaking the main flow
      return {
        success: false,
        message: "Failed to send order welcome message",
        error: error.message,
      };
    }
  }

  // Gửi tin nhắn cập nhật trạng thái đơn hàng
  async sendOrderStatusMessage(buyerId, sellerId, orderId, status) {
    try {
      console.log(
        `[CHAT_HELPER] Sending order status message for order ${orderId}, status: ${status}`
      );

      const response = await axios.post(
        `${this.baseURL}/api/chat/internal/order-status`,
        {
          buyerId,
          sellerId,
          orderId,
          status,
        },
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log(`[CHAT_HELPER] ✅ Order status message sent successfully`);
        return response.data;
      } else {
        console.error(
          `[CHAT_HELPER] ❌ Failed to send order status message:`,
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error(
        `[CHAT_HELPER] ❌ Error sending order status message:`,
        error.message
      );
      // Don't throw error to avoid breaking the main flow
      return {
        success: false,
        message: "Failed to send order status message",
        error: error.message,
      };
    }
  }

  // Kiểm tra chat service có hoạt động không
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 3000,
      });
      return response.data.success;
    } catch (error) {
      console.error(`[CHAT_HELPER] ❌ Health check failed:`, error.message);
      return false;
    }
  }
}

// Export singleton instance
const chatHelper = new ChatHelper();
export default chatHelper;
