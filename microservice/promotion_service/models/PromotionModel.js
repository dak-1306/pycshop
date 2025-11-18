import smartDB from "../../db/index.js";

class PromotionModel {
  // Lấy danh sách voucher phù hợp với giá trị đơn hàng tối thiểu
  static async getAvailableVouchers(orderValue, userId = null) {
    try {
      console.log(
        `[PROMOTION_MODEL] Getting vouchers for order value: ${orderValue}`
      );

      // Query lấy voucher còn hiệu lực và phù hợp với giá trị đơn hàng
      const [voucherRows] = await smartDB.executeRead(
        `SELECT 
          ID_Phieu,
          MaGiam,
          PhanTramGiam,
          SoLanDungDuoc,
          SoLanDaDung,
          GiaTriDonHangToiThieu,
          NgayHieuLuc,
          NgayHetHan,
          (SoLanDungDuoc - SoLanDaDung) as RemainingUses
        FROM phieugiamgia 
        WHERE 
          NgayHieuLuc <= CURDATE() 
          AND NgayHetHan >= CURDATE()
          AND SoLanDaDung < SoLanDungDuoc
          AND (GiaTriDonHangToiThieu IS NULL OR GiaTriDonHangToiThieu <= ?)
        ORDER BY 
          PhanTramGiam DESC, 
          GiaTriDonHangToiThieu ASC`,
        [orderValue]
      );

      console.log(
        `[PROMOTION_MODEL] Found ${voucherRows.length} available vouchers`
      );

      // Format response
      const vouchers = voucherRows.map((voucher) => ({
        id: voucher.ID_Phieu,
        code: voucher.MaGiam,
        discountPercent: parseFloat(voucher.PhanTramGiam),
        minOrderValue: parseFloat(voucher.GiaTriDonHangToiThieu) || 0,
        remainingUses: voucher.RemainingUses,
        validFrom: voucher.NgayHieuLuc,
        validUntil: voucher.NgayHetHan,
        discountAmount: Math.floor(
          (orderValue * parseFloat(voucher.PhanTramGiam)) / 100
        ),
        canUse: true,
      }));

      return vouchers;
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error getting available vouchers:",
        error
      );
      throw error;
    }
  }

  // Lấy voucher theo mã code
  static async getVoucherByCode(voucherCode) {
    try {
      console.log(`[PROMOTION_MODEL] Getting voucher by code: ${voucherCode}`);

      const [voucherRows] = await smartDB.executeRead(
        `SELECT 
          ID_Phieu,
          MaGiam,
          PhanTramGiam,
          SoLanDungDuoc,
          SoLanDaDung,
          GiaTriDonHangToiThieu,
          NgayHieuLuc,
          NgayHetHan
        FROM phieugiamgia 
        WHERE MaGiam = ?`,
        [voucherCode]
      );

      if (voucherRows.length === 0) {
        return null;
      }

      const voucher = voucherRows[0];

      // Check validity
      const now = new Date();
      const validFrom = new Date(voucher.NgayHieuLuc);
      const validUntil = new Date(voucher.NgayHetHan);

      const isValid =
        now >= validFrom &&
        now <= validUntil &&
        voucher.SoLanDaDung < voucher.SoLanDungDuoc;

      return {
        id: voucher.ID_Phieu,
        code: voucher.MaGiam,
        discountPercent: parseFloat(voucher.PhanTramGiam),
        minOrderValue: parseFloat(voucher.GiaTriDonHangToiThieu) || 0,
        remainingUses: voucher.SoLanDungDuoc - voucher.SoLanDaDung,
        validFrom: voucher.NgayHieuLuc,
        validUntil: voucher.NgayHetHan,
        isValid: isValid,
      };
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error getting voucher by code:", error);
      throw error;
    }
  }

  // Validate voucher cho đơn hàng
  static async validateVoucher(voucherCode, orderValue) {
    try {
      console.log(
        `[PROMOTION_MODEL] Validating voucher ${voucherCode} for order value ${orderValue}`
      );

      const voucher = await this.getVoucherByCode(voucherCode);

      if (!voucher) {
        return {
          valid: false,
          message: "Mã voucher không tồn tại",
        };
      }

      if (!voucher.isValid) {
        return {
          valid: false,
          message: "Mã voucher đã hết hạn hoặc đã được sử dụng hết",
        };
      }

      if (orderValue < voucher.minOrderValue) {
        return {
          valid: false,
          message: `Giá trị đơn hàng tối thiểu là ${voucher.minOrderValue.toLocaleString(
            "vi-VN"
          )}đ`,
        };
      }

      const discountAmount = Math.floor(
        (orderValue * voucher.discountPercent) / 100
      );

      return {
        valid: true,
        voucher: voucher,
        discountAmount: discountAmount,
        finalAmount: orderValue - discountAmount,
        message: "Mã voucher hợp lệ",
      };
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error validating voucher:", error);
      throw error;
    }
  }

  // Sử dụng voucher (tăng số lần đã dùng)
  static async useVoucher(voucherId) {
    try {
      console.log(`[PROMOTION_MODEL] Using voucher ${voucherId}`);

      const [result] = await smartDB.executeWrite(
        "UPDATE phieugiamgia SET SoLanDaDung = SoLanDaDung + 1 WHERE ID_Phieu = ?",
        [voucherId]
      );

      if (result.affectedRows > 0) {
        console.log(`[PROMOTION_MODEL] Successfully used voucher ${voucherId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error using voucher:", error);
      throw error;
    }
  }

  // Tạo voucher mới (cho admin)
  static async createVoucher(voucherData) {
    try {
      const {
        code,
        discountPercent,
        usageLimit,
        minOrderValue,
        validFrom,
        validUntil,
      } = voucherData;

      console.log(`[PROMOTION_MODEL] Creating new voucher: ${code}`);

      // Kiểm tra mã code đã tồn tại chưa
      const [existingRows] = await smartDB.executeRead(
        "SELECT ID_Phieu FROM phieugiamgia WHERE MaGiam = ?",
        [code]
      );

      if (existingRows.length > 0) {
        throw new Error("Mã voucher đã tồn tại");
      }

      // Tạo voucher mới
      const [result] = await smartDB.executeWrite(
        `INSERT INTO phieugiamgia 
         (MaGiam, PhanTramGiam, SoLanDungDuoc, GiaTriDonHangToiThieu, NgayHieuLuc, NgayHetHan)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          code,
          discountPercent,
          usageLimit,
          minOrderValue,
          validFrom,
          validUntil,
        ]
      );

      return {
        id: result.insertId,
        code: code,
        message: "Tạo voucher thành công",
      };
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error creating voucher:", error);
      throw error;
    }
  }

  // Lấy danh sách tất cả voucher (cho admin)
  static async getAllVouchers(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      console.log(`[PROMOTION_MODEL] Getting all vouchers, page ${page}`);

      const [voucherRows] = await smartDB.executeRead(
        `SELECT 
          ID_Phieu,
          MaGiam,
          PhanTramGiam,
          SoLanDungDuoc,
          SoLanDaDung,
          GiaTriDonHangToiThieu,
          NgayHieuLuc,
          NgayHetHan,
          CASE 
            WHEN NgayHetHan < CURDATE() THEN 'expired'
            WHEN NgayHieuLuc > CURDATE() THEN 'upcoming' 
            WHEN SoLanDaDung >= SoLanDungDuoc THEN 'used_up'
            ELSE 'active'
          END as status
        FROM phieugiamgia 
        ORDER BY ID_Phieu DESC
        LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      // Đếm tổng số voucher
      const [countRows] = await smartDB.executeRead(
        "SELECT COUNT(*) as total FROM phieugiamgia"
      );

      return {
        vouchers: voucherRows,
        pagination: {
          page: page,
          limit: limit,
          total: countRows[0].total,
          totalPages: Math.ceil(countRows[0].total / limit),
        },
      };
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error getting all vouchers:", error);
      throw error;
    }
  }

  // Lấy thống kê voucher (cho admin)
  static async getVoucherStatistics() {
    try {
      const [stats] = await smartDB.executeRead(
        `SELECT 
          COUNT(*) as totalVouchers,
          SUM(CASE WHEN NgayHetHan >= CURDATE() AND NgayHieuLuc <= CURDATE() AND SoLanDaDung < SoLanDungDuoc THEN 1 ELSE 0 END) as activeVouchers,
          SUM(CASE WHEN NgayHetHan < CURDATE() THEN 1 ELSE 0 END) as expiredVouchers,
          SUM(CASE WHEN SoLanDaDung >= SoLanDungDuoc THEN 1 ELSE 0 END) as usedUpVouchers,
          SUM(SoLanDaDung) as totalUsages,
          AVG(PhanTramGiam) as averageDiscount
        FROM phieugiamgia`
      );

      return {
        success: true,
        statistics: stats[0],
      };
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error getting voucher statistics:",
        error
      );
      throw error;
    }
  }

  // Xóa voucher (cho admin)
  static async deleteVoucher(voucherId) {
    try {
      console.log(`[PROMOTION_MODEL] Deleting voucher ${voucherId}`);

      const [result] = await smartDB.executeWrite(
        "DELETE FROM phieugiamgia WHERE ID_Phieu = ?",
        [voucherId]
      );

      if (result.affectedRows > 0) {
        console.log(
          `[PROMOTION_MODEL] Successfully deleted voucher ${voucherId}`
        );
        return {
          success: true,
          message: "Xóa voucher thành công",
        };
      } else {
        return {
          success: false,
          message: "Không tìm thấy voucher để xóa",
        };
      }
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error deleting voucher:", error);
      throw error;
    }
  }

  // Cập nhật voucher (cho admin)
  static async updateVoucher(voucherId, updateData) {
    try {
      const {
        code,
        discountPercent,
        usageLimit,
        minOrderValue,
        validFrom,
        validUntil,
      } = updateData;

      console.log(`[PROMOTION_MODEL] Updating voucher ${voucherId}`);

      // Kiểm tra mã code đã tồn tại chưa (nếu thay đổi code)
      if (code) {
        const [existingRows] = await smartDB.executeRead(
          "SELECT ID_Phieu FROM phieugiamgia WHERE MaGiam = ? AND ID_Phieu != ?",
          [code, voucherId]
        );

        if (existingRows.length > 0) {
          throw new Error("Mã voucher đã tồn tại");
        }
      }

      const [result] = await smartDB.executeWrite(
        `UPDATE phieugiamgia 
         SET MaGiam = COALESCE(?, MaGiam),
             PhanTramGiam = COALESCE(?, PhanTramGiam),
             SoLanDungDuoc = COALESCE(?, SoLanDungDuoc),
             GiaTriDonHangToiThieu = COALESCE(?, GiaTriDonHangToiThieu),
             NgayHieuLuc = COALESCE(?, NgayHieuLuc),
             NgayHetHan = COALESCE(?, NgayHetHan)
         WHERE ID_Phieu = ?`,
        [
          code,
          discountPercent,
          usageLimit,
          minOrderValue,
          validFrom,
          validUntil,
          voucherId,
        ]
      );

      if (result.affectedRows > 0) {
        return {
          success: true,
          message: "Cập nhật voucher thành công",
        };
      } else {
        return {
          success: false,
          message: "Không tìm thấy voucher để cập nhật",
        };
      }
    } catch (error) {
      console.error("[PROMOTION_MODEL] Error updating voucher:", error);
      throw error;
    }
  }
}

export default PromotionModel;
