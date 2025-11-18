// src/services/promotionService.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

class PromotionService {
  // Lấy danh sách voucher khả dụng theo giá trị đơn hàng
  async getAvailableVouchers(orderValue) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Getting vouchers for order value: ${orderValue}`
      );

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/promotions/available?orderValue=${orderValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể lấy danh sách voucher");
      }

      console.log(
        `[PROMOTION_SERVICE] Found ${data.data?.vouchers?.length || 0} vouchers`
      );
      return data;
    } catch (error) {
      console.error(
        "[PROMOTION_SERVICE] Error getting available vouchers:",
        error
      );
      throw error;
    }
  }

  // Validate voucher với giá trị đơn hàng
  async validateVoucher(voucherCode, orderValue) {
    try {
      console.log(
        `[PROMOTION_SERVICE] Validating voucher: ${voucherCode} for order: ${orderValue}`
      );

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/promotions/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          voucherCode: voucherCode.trim().toUpperCase(),
          orderValue: parseFloat(orderValue),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Voucher không hợp lệ");
      }

      console.log(`[PROMOTION_SERVICE] Voucher validation result:`, data.data);
      return data;
    } catch (error) {
      console.error("[PROMOTION_SERVICE] Error validating voucher:", error);
      throw error;
    }
  }

  // Lấy thông tin voucher theo code
  async getVoucherByCode(voucherCode) {
    try {
      console.log(`[PROMOTION_SERVICE] Getting voucher info: ${voucherCode}`);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/promotions/voucher/${voucherCode
          .trim()
          .toUpperCase()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không tìm thấy voucher");
      }

      return data;
    } catch (error) {
      console.error(
        "[PROMOTION_SERVICE] Error getting voucher by code:",
        error
      );
      throw error;
    }
  }

  // Format voucher cho hiển thị
  formatVoucher(voucher) {
    return {
      ...voucher,
      formattedMinOrder: voucher.minOrderValue
        ? `${voucher.minOrderValue.toLocaleString("vi-VN")}đ`
        : "Không có điều kiện",
      formattedDiscount: `${voucher.discountPercent}%`,
      formattedDiscountAmount: voucher.discountAmount
        ? `${voucher.discountAmount.toLocaleString("vi-VN")}đ`
        : "0đ",
      isExpired: new Date() > new Date(voucher.validUntil),
      isUpcoming: new Date() < new Date(voucher.validFrom),
      daysUntilExpire: this.calculateDaysUntilExpire(voucher.validUntil),
    };
  }

  // Tính số ngày còn lại của voucher
  calculateDaysUntilExpire(validUntil) {
    const now = new Date();
    const expireDate = new Date(validUntil);
    const diffTime = expireDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  // Tính toán giá sau khi áp dụng voucher
  calculateDiscountedPrice(originalPrice, discountPercent, maxDiscount = null) {
    const discountAmount = Math.floor((originalPrice * discountPercent) / 100);
    const actualDiscount = maxDiscount
      ? Math.min(discountAmount, maxDiscount)
      : discountAmount;

    return {
      originalPrice,
      discountAmount: actualDiscount,
      finalPrice: originalPrice - actualDiscount,
      savedAmount: actualDiscount,
    };
  }

  // Lọc voucher theo điều kiện
  filterVouchers(vouchers, filters = {}) {
    return vouchers.filter((voucher) => {
      const { minDiscount, maxDiscount, onlyAvailable = true } = filters;

      // Lọc theo trạng thái khả dụng
      if (onlyAvailable && !voucher.canUse) {
        return false;
      }

      // Lọc theo phần trăm giảm giá tối thiểu
      if (minDiscount && voucher.discountPercent < minDiscount) {
        return false;
      }

      // Lọc theo phần trăm giảm giá tối đa
      if (maxDiscount && voucher.discountPercent > maxDiscount) {
        return false;
      }

      return true;
    });
  }

  // Sắp xếp voucher theo độ ưu tiên
  sortVouchersByPriority(vouchers, orderValue) {
    return vouchers.sort((a, b) => {
      // Ưu tiên voucher có discount amount cao hơn
      const discountA = this.calculateDiscountedPrice(
        orderValue,
        a.discountPercent
      );
      const discountB = this.calculateDiscountedPrice(
        orderValue,
        b.discountPercent
      );

      if (discountA.savedAmount !== discountB.savedAmount) {
        return discountB.savedAmount - discountA.savedAmount;
      }

      // Nếu discount amount bằng nhau, ưu tiên theo phần trăm
      if (a.discountPercent !== b.discountPercent) {
        return b.discountPercent - a.discountPercent;
      }

      // Cuối cùng ưu tiên theo min order value thấp hơn
      return a.minOrderValue - b.minOrderValue;
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/promotions/health`);
      return await response.json();
    } catch (error) {
      console.error("[PROMOTION_SERVICE] Health check failed:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new PromotionService();
