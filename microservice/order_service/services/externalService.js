// Service để giao tiếp với các microservice khác
import fetch from "node-fetch";

export class ExternalServiceClient {
  // Clear user cart after successful order
  static async clearUserCart(userId) {
    try {
      const cartServiceUrl =
        process.env.CART_SERVICE_URL || "http://localhost:5004";

      console.log(`[EXTERNAL_SERVICE] Clearing cart for user ${userId}`);

      const response = await fetch(`${cartServiceUrl}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId.toString(),
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          `[EXTERNAL_SERVICE] Successfully cleared cart for user ${userId}`
        );
        return result;
      } else {
        console.error(
          `[EXTERNAL_SERVICE] Failed to clear cart: ${response.status}`
        );
        return null;
      }
    } catch (error) {
      console.error("[EXTERNAL_SERVICE] Error clearing cart:", error);
      return null;
    }
  }

  // Send notification about new order
  static async sendOrderNotification(userId, orderData) {
    try {
      const notificationServiceUrl =
        process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5008";

      const notificationData = {
        userId: userId,
        type: "order",
        message: `Đơn hàng #${
          orderData.orderId
        } đã được tạo thành công với tổng giá trị ${orderData.total.toLocaleString(
          "vi-VN"
        )}đ`,
        data: {
          orderId: orderData.orderId,
          total: orderData.total,
          status: "pending",
        },
      };

      console.log(
        `[EXTERNAL_SERVICE] Sending order notification for user ${userId}`
      );

      const response = await fetch(`${notificationServiceUrl}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        console.log(`[EXTERNAL_SERVICE] Successfully sent order notification`);
      } else {
        console.error(
          `[EXTERNAL_SERVICE] Failed to send notification: ${response.status}`
        );
      }
    } catch (error) {
      console.error("[EXTERNAL_SERVICE] Error sending notification:", error);
    }
  }

  // Update product inventory after order
  static async updateProductInventory(items) {
    try {
      const productServiceUrl =
        process.env.PRODUCT_SERVICE_URL || "http://localhost:5002";

      console.log("[EXTERNAL_SERVICE] Updating product inventory");

      for (const item of items) {
        const response = await fetch(
          `${productServiceUrl}/products/${item.id}/inventory`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantityChange: -item.quantity, // Decrease inventory
              reason: "order_placed",
            }),
          }
        );

        if (!response.ok) {
          console.error(
            `[EXTERNAL_SERVICE] Failed to update inventory for product ${item.id}`
          );
        }
      }
    } catch (error) {
      console.error(
        "[EXTERNAL_SERVICE] Error updating product inventory:",
        error
      );
    }
  }

  // Use voucher (mark as used in promotion service)
  static async useVoucher(voucherData) {
    try {
      const promotionServiceUrl =
        process.env.PROMOTION_SERVICE_URL || "http://localhost:5009";

      console.log(
        `[EXTERNAL_SERVICE] Using voucher: ${
          voucherData.code || voucherData.id
        }`
      );

      const response = await fetch(
        `${promotionServiceUrl}/api/promotions/use`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voucherId: voucherData.id,
            voucherCode: voucherData.code,
            orderValue: voucherData.orderValue,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`[EXTERNAL_SERVICE] Successfully used voucher`);
        return result;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[EXTERNAL_SERVICE] Failed to use voucher: ${response.status}`,
          errorData.message || "Unknown error"
        );
        return null;
      }
    } catch (error) {
      console.error("[EXTERNAL_SERVICE] Error using voucher:", error);
      return null;
    }
  }

  // Validate voucher before using (optional double-check)
  static async validateVoucher(voucherCode, orderValue) {
    try {
      const promotionServiceUrl =
        process.env.PROMOTION_SERVICE_URL || "http://localhost:5009";

      console.log(`[EXTERNAL_SERVICE] Validating voucher: ${voucherCode}`);

      const response = await fetch(
        `${promotionServiceUrl}/api/promotions/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voucherCode: voucherCode,
            orderValue: orderValue,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(
          `[EXTERNAL_SERVICE] Voucher validation result:`,
          result.data?.valid
        );
        return result;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[EXTERNAL_SERVICE] Voucher validation failed: ${response.status}`,
          errorData.message || "Unknown error"
        );
        return { success: false, data: { valid: false } };
      }
    } catch (error) {
      console.error("[EXTERNAL_SERVICE] Error validating voucher:", error);
      return { success: false, data: { valid: false } };
    }
  }
}

export default ExternalServiceClient;
