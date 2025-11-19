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
          NgayHieuLuc <= NOW() 
          AND NgayHetHan >= NOW()
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

  // Sử dụng voucher đơn giản (chỉ cập nhật số lần đã dùng)
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

  // Sử dụng voucher với đầy đủ thông tin đơn hàng (cập nhật cả phieugiamgia và apma)
  static async useVoucherForOrder(voucherData) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[PROMOTION_MODEL] Using voucher for order ${voucherData.orderId}`
      );

      const {
        voucherId,
        userId,
        orderId,
        orderValue,
        discountAmount,
        voucherCode,
      } = voucherData;

      // 1. Kiểm tra voucher có còn khả dụng không
      const [voucherRows] = await connection.execute(
        `SELECT ID_Phieu, MaGiam, SoLanDungDuoc, SoLanDaDung, PhanTramGiam, GiaTriDonHangToiThieu
         FROM phieugiamgia 
         WHERE ID_Phieu = ? AND SoLanDaDung < SoLanDungDuoc`,
        [voucherId]
      );

      if (voucherRows.length === 0) {
        throw new Error("Voucher không khả dụng hoặc đã hết lượt sử dụng");
      }

      // 2. Cập nhật số lần đã dùng trong bảng phieugiamgia
      const [updateResult] = await connection.execute(
        "UPDATE phieugiamgia SET SoLanDaDung = SoLanDaDung + 1 WHERE ID_Phieu = ?",
        [voucherId]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error("Không thể cập nhật voucher");
      }

      // 3. Ghi lịch sử sử dụng vào bảng apma
      const [insertResult] = await connection.execute(
        `INSERT INTO apma (ID_Phieu, ID_NguoiDung, ID_DonHang, GiaTriDonHang, SoTienGiam, ThoiGianSuDung, TrangThai, GhiChu)
         VALUES (?, ?, ?, ?, ?, NOW(), 'used', ?)`,
        [
          voucherId,
          userId,
          orderId,
          orderValue,
          discountAmount,
          `Sử dụng voucher ${voucherCode} cho đơn hàng ${orderId}`,
        ]
      );

      await connection.commit();
      console.log(
        `[PROMOTION_MODEL] Successfully used voucher ${voucherCode} for order ${orderId}`
      );

      return {
        success: true,
        message: "Sử dụng voucher thành công",
        data: {
          usageId: insertResult.insertId,
          voucherId: voucherId,
          discountAmount: discountAmount,
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("[PROMOTION_MODEL] Error using voucher for order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Rollback voucher usage (trong trường hợp hủy đơn hàng)
  static async rollbackVoucherUsage(orderId) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[PROMOTION_MODEL] Rolling back voucher usage for order ${orderId}`
      );

      // 1. Tìm voucher đã sử dụng cho đơn hàng này
      const [usageRows] = await connection.execute(
        "SELECT ID_Phieu, ID_ApMa FROM apma WHERE ID_DonHang = ? AND TrangThai = 'used'",
        [orderId]
      );

      if (usageRows.length === 0) {
        console.log(
          `[PROMOTION_MODEL] No voucher usage found for order ${orderId}`
        );
        await connection.commit();
        return { success: true, message: "No voucher to rollback" };
      }

      for (const usage of usageRows) {
        // 2. Giảm số lần đã dùng trong bảng phieugiamgia
        await connection.execute(
          "UPDATE phieugiamgia SET SoLanDaDung = SoLanDaDung - 1 WHERE ID_Phieu = ?",
          [usage.ID_Phieu]
        );

        // 3. Cập nhật trạng thái trong bảng apma
        await connection.execute(
          "UPDATE apma SET TrangThai = 'cancelled', GhiChu = CONCAT(IFNULL(GhiChu, ''), ' - Đã hủy do hủy đơn hàng') WHERE ID_ApMa = ?",
          [usage.ID_ApMa]
        );

        console.log(
          `[PROMOTION_MODEL] Rolled back voucher ${usage.ID_Phieu} for order ${orderId}`
        );
      }

      await connection.commit();

      return {
        success: true,
        message: "Rollback voucher usage completed",
        rolledBackCount: usageRows.length,
      };
    } catch (error) {
      await connection.rollback();
      console.error(
        "[PROMOTION_MODEL] Error rolling back voucher usage:",
        error
      );
      throw error;
    } finally {
      connection.release();
    }
  }

  // Kiểm tra user đã sử dụng voucher này bao nhiều lần
  static async getUserVoucherUsageCount(userId, voucherId) {
    try {
      const [countRows] = await smartDB.executeRead(
        "SELECT COUNT(*) as usageCount FROM apma WHERE ID_NguoiDung = ? AND ID_Phieu = ?",
        [userId, voucherId]
      );

      return countRows[0].usageCount;
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error getting user voucher usage count:",
        error
      );
      throw error;
    }
  }

  // Ghi log sử dụng voucher vào bảng apma và cập nhật số lần đã dùng
  static async useVoucherWithLogging(voucherId, userId, orderId) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[PROMOTION_MODEL] Starting transaction to use voucher ${voucherId} for order ${orderId}`
      );

      // 1. Kiểm tra voucher có còn hiệu lực và còn lượt sử dụng không
      const [voucherRows] = await connection.execute(
        `SELECT ID_Phieu, MaGiam, SoLanDungDuoc, SoLanDaDung, NgayHieuLuc, NgayHetHan 
         FROM phieugiamgia 
         WHERE ID_Phieu = ? AND NgayHieuLuc <= NOW() AND NgayHetHan >= NOW()`,
        [voucherId]
      );

      if (voucherRows.length === 0) {
        throw new Error("Voucher not found or expired");
      }

      const voucher = voucherRows[0];

      if (voucher.SoLanDaDung >= voucher.SoLanDungDuoc) {
        throw new Error("Voucher usage limit exceeded");
      }

      // 2. Kiểm tra user đã sử dụng voucher này cho đơn hàng này chưa
      const [existingUsage] = await connection.execute(
        "SELECT ID_ApMa FROM apma WHERE ID_Phieu = ? AND ID_NguoiDung = ? AND ID_DonHang = ?",
        [voucherId, userId, orderId]
      );

      if (existingUsage.length > 0) {
        throw new Error("Voucher already used for this order");
      }

      // 3. Ghi log vào bảng apma
      await connection.execute(
        "INSERT INTO apma (ID_Phieu, ID_NguoiDung, ID_DonHang, SuDungLuc) VALUES (?, ?, ?, NOW())",
        [voucherId, userId, orderId]
      );

      // 4. Cập nhật số lần đã dùng trong bảng phieugiamgia
      await connection.execute(
        "UPDATE phieugiamgia SET SoLanDaDung = SoLanDaDung + 1 WHERE ID_Phieu = ?",
        [voucherId]
      );

      await connection.commit();
      console.log(
        `[PROMOTION_MODEL] Successfully used voucher ${voucher.MaGiam} for order ${orderId}`
      );

      return {
        success: true,
        message: "Voucher used successfully",
        data: {
          voucherId,
          voucherCode: voucher.MaGiam,
          userId,
          orderId,
          usedAt: new Date(),
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("[PROMOTION_MODEL] Error using voucher:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy lịch sử sử dụng voucher của user
  static async getUserVoucherHistory(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const [historyRows] = await smartDB.executeRead(
        `SELECT 
          a.ID_ApMa,
          a.ID_DonHang,
          a.SuDungLuc,
          p.MaGiam,
          p.PhanTramGiam,
          dh.TongGia as orderValue
        FROM apma a
        LEFT JOIN phieugiamgia p ON a.ID_Phieu = p.ID_Phieu
        LEFT JOIN donhang dh ON a.ID_DonHang = dh.ID_DonHang
        WHERE a.ID_NguoiDung = ?
        ORDER BY a.SuDungLuc DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      // Đếm tổng số records
      const [countResult] = await smartDB.executeRead(
        "SELECT COUNT(*) as total FROM apma WHERE ID_NguoiDung = ?",
        [userId]
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: historyRows.map((row) => ({
          id: row.ID_ApMa,
          orderId: row.ID_DonHang,
          voucherCode: row.MaGiam,
          discountPercent: parseFloat(row.PhanTramGiam),
          orderValue: parseFloat(row.orderValue),
          discountAmount: Math.floor(
            (parseFloat(row.orderValue) * parseFloat(row.PhanTramGiam)) / 100
          ),
          usedAt: row.SuDungLuc,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error getting user voucher history:",
        error
      );
      throw error;
    }
  }

  // Lấy lịch sử sử dụng của một voucher cụ thể
  static async getVoucherUsageHistory(voucherId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const [historyRows] = await smartDB.executeRead(
        `SELECT 
          a.ID_ApMa,
          a.ID_NguoiDung,
          a.ID_DonHang,
          a.SuDungLuc,
          nd.HoTen as userName,
          dh.TongGia as orderValue
        FROM apma a
        LEFT JOIN nguoidung nd ON a.ID_NguoiDung = nd.ID_NguoiDung
        LEFT JOIN donhang dh ON a.ID_DonHang = dh.ID_DonHang
        WHERE a.ID_Phieu = ?
        ORDER BY a.SuDungLuc DESC
        LIMIT ? OFFSET ?`,
        [voucherId, limit, offset]
      );

      // Đếm tổng số records
      const [countResult] = await smartDB.executeRead(
        "SELECT COUNT(*) as total FROM apma WHERE ID_Phieu = ?",
        [voucherId]
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: historyRows.map((row) => ({
          id: row.ID_ApMa,
          userId: row.ID_NguoiDung,
          userName: row.userName,
          orderId: row.ID_DonHang,
          orderValue: parseFloat(row.orderValue),
          usedAt: row.SuDungLuc,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error getting voucher usage history:",
        error
      );
      throw error;
    }
  }

  // Kiểm tra voucher đã được sử dụng cho đơn hàng cụ thể chưa
  static async isVoucherUsedForOrder(voucherId, orderId) {
    try {
      const [rows] = await smartDB.executeRead(
        "SELECT ID_ApMa FROM apma WHERE ID_Phieu = ? AND ID_DonHang = ?",
        [voucherId, orderId]
      );

      return rows.length > 0;
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error checking voucher usage for order:",
        error
      );
      throw error;
    }
  }

  // Lấy thống kê tổng quan về voucher
  static async getVoucherStatistics(voucherId = null) {
    try {
      let query, params;

      if (voucherId) {
        // Thống kê cho voucher cụ thể
        query = `
          SELECT 
            p.ID_Phieu,
            p.MaGiam,
            p.SoLanDungDuoc,
            p.SoLanDaDung,
            (p.SoLanDungDuoc - p.SoLanDaDung) as remainingUses,
            COUNT(a.ID_ApMa) as actualUsageCount,
            COUNT(DISTINCT a.ID_NguoiDung) as uniqueUsers,
            COALESCE(SUM(dh.TongGia), 0) as totalOrderValue,
            COALESCE(AVG(dh.TongGia), 0) as avgOrderValue
          FROM phieugiamgia p
          LEFT JOIN apma a ON p.ID_Phieu = a.ID_Phieu
          LEFT JOIN donhang dh ON a.ID_DonHang = dh.ID_DonHang
          WHERE p.ID_Phieu = ?
          GROUP BY p.ID_Phieu
        `;
        params = [voucherId];
      } else {
        // Thống kê tổng quan
        query = `
          SELECT 
            COUNT(DISTINCT p.ID_Phieu) as totalVouchers,
            COUNT(DISTINCT a.ID_ApMa) as totalUsages,
            COUNT(DISTINCT a.ID_NguoiDung) as totalUniqueUsers,
            COALESCE(SUM(dh.TongGia), 0) as totalOrderValue,
            COALESCE(AVG(dh.TongGia), 0) as avgOrderValue
          FROM phieugiamgia p
          LEFT JOIN apma a ON p.ID_Phieu = a.ID_Phieu
          LEFT JOIN donhang dh ON a.ID_DonHang = dh.ID_DonHang
        `;
        params = [];
      }

      const [rows] = await smartDB.executeRead(query, params);

      return {
        success: true,
        data: rows[0],
      };
    } catch (error) {
      console.error(
        "[PROMOTION_MODEL] Error getting voucher statistics:",
        error
      );
      throw error;
    }
  }
}

export default PromotionModel;
