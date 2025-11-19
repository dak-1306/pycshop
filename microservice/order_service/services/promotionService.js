// Service to communicate with Promotion Service for voucher management
class PromotionService {
  constructor() {
    this.baseUrl = process.env.PROMOTION_SERVICE_URL || "http://localhost:5009";
  }

  // Validate voucher trước khi tạo đơn hàng
  async validateVoucher(voucherCode, orderValue) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Validating voucher ${voucherCode} for order value ${orderValue}`
      );

      const response = await fetch(`${this.baseUrl}/api/promotions/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voucherCode,
          orderValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PROMOTION_SERVICE] Failed to validate voucher. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Promotion service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(`[PROMOTION_SERVICE] Voucher validation result:`, data);

      return {
        success: true,
        valid: data.success,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error(`[PROMOTION_SERVICE] Error validating voucher:`, error);
      return {
        success: false,
        message: "Failed to communicate with promotion service",
        error: error.message,
      };
    }
  }

  // Sử dụng voucher sau khi tạo đơn hàng thành công
  async useVoucher(voucherId, userId, orderId) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Using voucher ${voucherId} for order ${orderId} by user ${userId}`
      );

      const response = await fetch(
        `${this.baseUrl}/api/promotions/use-voucher`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            voucherId,
            userId,
            orderId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PROMOTION_SERVICE] Failed to use voucher. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Promotion service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(`[PROMOTION_SERVICE] Successfully used voucher:`, data);

      return {
        success: true,
        message: "Voucher applied successfully",
        data: data.data,
      };
    } catch (error) {
      console.error(`[PROMOTION_SERVICE] Error using voucher:`, error);
      return {
        success: false,
        message: "Failed to communicate with promotion service",
        error: error.message,
      };
    }
  }

  // Lấy thông tin voucher theo code
  async getVoucherByCode(voucherCode) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Getting voucher by code: ${voucherCode}`
      );

      const response = await fetch(
        `${this.baseUrl}/api/promotions/voucher/${voucherCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PROMOTION_SERVICE] Failed to get voucher. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Promotion service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(`[PROMOTION_SERVICE] Retrieved voucher:`, data);

      return {
        success: true,
        voucher: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error(`[PROMOTION_SERVICE] Error getting voucher:`, error);
      return {
        success: false,
        message: "Failed to communicate with promotion service",
        error: error.message,
      };
    }
  }

  // Lấy danh sách voucher có thể áp dụng
  async getAvailableVouchers(orderValue, userId = null) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Getting available vouchers for order value ${orderValue}`
      );

      const response = await fetch(
        `${this.baseUrl}/api/promotions/available?orderValue=${orderValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(userId && { "x-user-id": userId.toString() }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PROMOTION_SERVICE] Failed to get available vouchers. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Promotion service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[PROMOTION_SERVICE] Retrieved ${
          data.data?.vouchers?.length || 0
        } available vouchers`
      );

      return {
        success: true,
        vouchers: data.data?.vouchers || [],
        message: data.message,
      };
    } catch (error) {
      console.error(
        `[PROMOTION_SERVICE] Error getting available vouchers:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with promotion service",
        error: error.message,
      };
    }
  }

  // Lấy lịch sử sử dụng voucher của user
  async getUserVoucherHistory(userId, page = 1, limit = 20) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Getting voucher history for user ${userId}`
      );

      const response = await fetch(
        `${this.baseUrl}/api/promotions/user-history/${userId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PROMOTION_SERVICE] Failed to get user voucher history. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Promotion service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[PROMOTION_SERVICE] Retrieved voucher history for user ${userId}`
      );

      return {
        success: true,
        data: data.data,
        pagination: data.pagination,
        message: data.message,
      };
    } catch (error) {
      console.error(
        `[PROMOTION_SERVICE] Error getting user voucher history:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with promotion service",
        error: error.message,
      };
    }
  }

  // Check promotion service health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/promotions/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return {
          success: false,
          message: `Health check failed with status ${response.status}`,
        };
      }
    } catch (error) {
      console.error("[PROMOTION_SERVICE] Health check failed:", error);
      return {
        success: false,
        message: "Failed to reach promotion service",
        error: error.message,
      };
    }
  }
}

export default new PromotionService();
