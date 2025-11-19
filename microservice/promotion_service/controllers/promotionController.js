import PromotionModel from "../models/PromotionModel.js";

class PromotionController {
  // [GET] /api/promotions/available?orderValue=amount
  // Lấy danh sách voucher phù hợp với giá trị đơn hàng
  static async getAvailableVouchers(req, res) {
    try {
      const { orderValue } = req.query;
      const userId =
        req.headers["x-user-id"] || req.user?.id || req.user?.userId; // From API Gateway

      console.log(`[PROMOTION_CONTROLLER] Request headers:`, {
        "x-user-id": req.headers["x-user-id"],
        "x-user-role": req.headers["x-user-role"],
        "x-user-type": req.headers["x-user-type"],
      });

      // Validate orderValue
      if (!orderValue || isNaN(orderValue) || orderValue <= 0) {
        return res.status(400).json({
          success: false,
          message: "Giá trị đơn hàng không hợp lệ",
        });
      }

      console.log(
        `[PROMOTION_CONTROLLER] Getting vouchers for user ${userId}, order value: ${orderValue}`
      );

      const vouchers = await PromotionModel.getAvailableVouchers(
        parseFloat(orderValue),
        userId
      );

      res.json({
        success: true,
        data: {
          vouchers: vouchers,
          orderValue: parseFloat(orderValue),
          availableCount: vouchers.length,
        },
        message: `Tìm thấy ${vouchers.length} voucher phù hợp`,
      });
    } catch (error) {
      console.error(
        "[PROMOTION_CONTROLLER] Error getting available vouchers:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh sách voucher",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // [POST] /api/promotions/validate
  // Validate voucher code với giá trị đơn hàng
  static async validateVoucher(req, res) {
    try {
      const { voucherCode, orderValue } = req.body;

      // Validate input
      if (!voucherCode || !orderValue || isNaN(orderValue) || orderValue <= 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
        });
      }

      console.log(
        `[PROMOTION_CONTROLLER] Validating voucher: ${voucherCode} for order: ${orderValue}`
      );

      const validation = await PromotionModel.validateVoucher(
        voucherCode.trim().toUpperCase(),
        parseFloat(orderValue)
      );

      if (validation.valid) {
        res.json({
          success: true,
          data: validation,
          message: validation.message,
        });
      } else {
        res.status(400).json({
          success: false,
          message: validation.message,
          data: { valid: false },
        });
      }
    } catch (error) {
      console.error("[PROMOTION_CONTROLLER] Error validating voucher:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi kiểm tra voucher",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // [GET] /api/promotions/voucher/:code
  // Lấy thông tin voucher theo code
  static async getVoucherByCode(req, res) {
    try {
      const { code } = req.params;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Mã voucher không được để trống",
        });
      }

      console.log(`[PROMOTION_CONTROLLER] Getting voucher by code: ${code}`);

      const voucher = await PromotionModel.getVoucherByCode(
        code.trim().toUpperCase()
      );

      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy voucher",
        });
      }

      res.json({
        success: true,
        data: voucher,
        message: "Lấy thông tin voucher thành công",
      });
    } catch (error) {
      console.error(
        "[PROMOTION_CONTROLLER] Error getting voucher by code:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy thông tin voucher",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // [POST] /api/promotions/use
  // Sử dụng voucher (được gọi từ order service)
  static async useVoucher(req, res) {
    try {
      const { voucherId, voucherCode, orderValue } = req.body;

      if (!voucherId && !voucherCode) {
        return res.status(400).json({
          success: false,
          message: "Cần cung cấp ID voucher hoặc mã voucher",
        });
      }

      console.log(
        `[PROMOTION_CONTROLLER] Using voucher: ${voucherId || voucherCode}`
      );

      let voucher;
      if (voucherCode && !voucherId) {
        // Lấy voucher theo code trước
        voucher = await PromotionModel.getVoucherByCode(voucherCode);
        if (!voucher) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy voucher",
          });
        }
      }

      // Validate trước khi sử dụng
      if (orderValue && voucherCode) {
        const validation = await PromotionModel.validateVoucher(
          voucherCode,
          orderValue
        );
        if (!validation.valid) {
          return res.status(400).json({
            success: false,
            message: validation.message,
          });
        }
      }

      // Sử dụng voucher
      const success = await PromotionModel.useVoucher(voucherId || voucher.id);

      if (success) {
        res.json({
          success: true,
          message: "Sử dụng voucher thành công",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Không thể sử dụng voucher",
        });
      }
    } catch (error) {
      console.error("[PROMOTION_CONTROLLER] Error using voucher:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi sử dụng voucher",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // [POST] /api/promotions/admin/create
  // Tạo voucher mới (chỉ admin)
  static async createVoucher(req, res) {
    try {
      const {
        code,
        discountPercent,
        usageLimit,
        minOrderValue,
        validFrom,
        validUntil,
      } = req.body;

      // Validate input
      if (
        !code ||
        !discountPercent ||
        !usageLimit ||
        !validFrom ||
        !validUntil
      ) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc",
        });
      }

      if (discountPercent <= 0 || discountPercent > 100) {
        return res.status(400).json({
          success: false,
          message: "Phần trăm giảm giá phải từ 1% đến 100%",
        });
      }

      if (usageLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: "Số lần sử dụng phải lớn hơn 0",
        });
      }

      console.log(`[PROMOTION_CONTROLLER] Creating voucher: ${code}`);

      const result = await PromotionModel.createVoucher({
        code: code.trim().toUpperCase(),
        discountPercent,
        usageLimit,
        minOrderValue: minOrderValue || 0,
        validFrom,
        validUntil,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      console.error("[PROMOTION_CONTROLLER] Error creating voucher:", error);

      if (error.message === "Mã voucher đã tồn tại") {
        res.status(409).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Lỗi hệ thống khi tạo voucher",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    }
  }

  // [GET] /api/promotions/admin/all
  // Lấy tất cả voucher (cho admin)
  static async getAllVouchers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      console.log(`[PROMOTION_CONTROLLER] Getting all vouchers, page ${page}`);

      const result = await PromotionModel.getAllVouchers(page, limit);

      res.json({
        success: true,
        data: result,
        message: "Lấy danh sách voucher thành công",
      });
    } catch (error) {
      console.error(
        "[PROMOTION_CONTROLLER] Error getting all vouchers:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh sách voucher",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // [POST] /api/promotions/use-voucher
  // Sử dụng voucher và ghi log (được gọi từ order service)
  static async useVoucherWithLogging(req, res) {
    try {
      const { voucherId, userId, orderId } = req.body;

      console.log(
        `[PROMOTION_CONTROLLER] Using voucher ${voucherId} for order ${orderId} by user ${userId}`
      );

      // Validation
      if (!voucherId || !userId || !orderId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin: voucherId, userId, orderId",
        });
      }

      const result = await PromotionModel.useVoucherWithLogging(
        voucherId,
        userId,
        orderId
      );

      res.json({
        success: true,
        message: "Áp dụng voucher thành công",
        data: result.data,
      });
    } catch (error) {
      console.error("[PROMOTION_CONTROLLER] Error using voucher:", error);

      let statusCode = 500;
      let message = "Lỗi khi áp dụng voucher";

      if (
        error.message.includes("not found") ||
        error.message.includes("expired")
      ) {
        statusCode = 404;
        message = "Voucher không tồn tại hoặc đã hết hạn";
      } else if (error.message.includes("limit exceeded")) {
        statusCode = 400;
        message = "Voucher đã hết lượt sử dụng";
      } else if (error.message.includes("already used")) {
        statusCode = 400;
        message = "Voucher đã được sử dụng cho đơn hàng này";
      }

      res.status(statusCode).json({
        success: false,
        message,
        error: error.message,
      });
    }
  }

  // [GET] /api/promotions/user-history/:userId
  // Lấy lịch sử sử dụng voucher của user
  static async getUserVoucherHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      console.log(
        `[PROMOTION_CONTROLLER] Getting voucher history for user ${userId}`
      );

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const result = await PromotionModel.getUserVoucherHistory(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: `Lấy lịch sử sử dụng voucher thành công`,
      });
    } catch (error) {
      console.error(
        "[PROMOTION_CONTROLLER] Error getting user voucher history:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy lịch sử sử dụng voucher",
        error: error.message,
      });
    }
  }

  // [GET] /api/promotions/voucher-history/:voucherId
  // Lấy lịch sử sử dụng của voucher cụ thể (cho admin)
  static async getVoucherUsageHistory(req, res) {
    try {
      const { voucherId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      console.log(
        `[PROMOTION_CONTROLLER] Getting usage history for voucher ${voucherId}`
      );

      if (!voucherId) {
        return res.status(400).json({
          success: false,
          message: "Voucher ID is required",
        });
      }

      const result = await PromotionModel.getVoucherUsageHistory(
        voucherId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: `Lấy lịch sử sử dụng voucher thành công`,
      });
    } catch (error) {
      console.error(
        "[PROMOTION_CONTROLLER] Error getting voucher usage history:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy lịch sử sử dụng voucher",
        error: error.message,
      });
    }
  }

  // [GET] /api/promotions/statistics/:voucherId?
  // Lấy thống kê voucher
  static async getVoucherStatistics(req, res) {
    try {
      const { voucherId } = req.params;

      console.log(
        `[PROMOTION_CONTROLLER] Getting statistics for voucher ${
          voucherId || "all"
        }`
      );

      const result = await PromotionModel.getVoucherStatistics(
        voucherId || null
      );

      res.json({
        success: true,
        data: result.data,
        message: "Lấy thống kê voucher thành công",
      });
    } catch (error) {
      console.error(
        "[PROMOTION_CONTROLLER] Error getting voucher statistics:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê voucher",
        error: error.message,
      });
    }
  }

  // [GET] /api/promotions/health
  // Health check endpoint
  static async healthCheck(req, res) {
    res.json({
      success: true,
      service: "Promotion Service",
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Promotion service is running normally",
    });
  }
}

export default PromotionController;
