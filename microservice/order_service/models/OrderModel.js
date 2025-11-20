import smartDB from "../../db/index.js";

class OrderModel {
  // Tạo đơn hàng mới với transaction
  static async createOrder(orderData) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[ORDER_MODEL] Starting transaction for user ${orderData.userId}`
      );

      const { userId, items, shippingAddress, paymentMethod, totalAmount } =
        orderData;

      // 1. Tạo đơn hàng chính trong bảng donhang
      const [orderResult] = await connection.execute(
        `INSERT INTO donhang (ID_NguoiMua, TongGia, TrangThai, ThoiGianTao)
         VALUES (?, ?, 'pending', NOW())`,
        [userId, totalAmount]
      );

      const orderId = orderResult.insertId;
      console.log(`[ORDER_MODEL] Created order ID: ${orderId}`);

      // 2. Tạo chi tiết đơn hàng trong bảng chitietdonhang
      for (const item of items) {
        await connection.execute(
          `INSERT INTO chitietdonhang (ID_DonHang, ID_SanPham, DonGia, SoLuong)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.productId, item.price, item.quantity]
        );
        console.log(
          `[ORDER_MODEL] Added item: Product ${item.productId} x${item.quantity}`
        );
      }

      // 3. Tạo thông tin thanh toán trong bảng thanhtoan
      const paymentMethodMap = {
        cod: "COD",
        bank_transfer: "CBS",
        momo: "CBS",
        zalopay: "CBS",
      };

      const dbPaymentMethod = paymentMethodMap[paymentMethod] || "COD";
      const paymentStatus = paymentMethod === "cod" ? "unpaid" : "paid";

      await connection.execute(
        `INSERT INTO thanhtoan (ID_DonHang, PhuongThuc, TrangThai, ThoiGianTao)
         VALUES (?, ?, ?, NOW())`,
        [orderId, dbPaymentMethod, paymentStatus]
      );
      console.log(`[ORDER_MODEL] Created payment record: ${dbPaymentMethod}`);

      // 4. Tạo thông tin giao hàng trong bảng giaohang
      await connection.execute(
        `INSERT INTO giaohang (ID_DonHang, DiaChi, TrangThai)
         VALUES (?, ?, 'undelivery')`,
        [orderId, shippingAddress]
      );
      console.log(`[ORDER_MODEL] Created delivery record`);

      // Commit transaction
      await connection.commit();
      console.log(`[ORDER_MODEL] Transaction committed successfully`);

      return {
        success: true,
        orderId: orderId,
        message: "Order created successfully",
      };
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await connection.rollback();
      console.error("[ORDER_MODEL] Transaction failed, rolling back:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy thông tin đơn hàng theo ID
  static async getOrderById(orderId, userId = null) {
    try {
      let query = `
        SELECT 
          dh.ID_DonHang as orderId,
          dh.ID_NguoiMua as userId,
          dh.TongGia as totalAmount,
          dh.ThoiGianTao as createdAt,
          dh.TrangThai as status,
          tt.PhuongThuc as paymentMethod,
          tt.TrangThai as paymentStatus,
          gh.DiaChi as shippingAddress,
          gh.TrangThai as deliveryStatus,
          gh.NgayVanChuyen as shippedAt,
          gh.NgayGiaoToi as deliveredAt
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN giaohang gh ON dh.ID_DonHang = gh.ID_DonHang
        WHERE dh.ID_DonHang = ?
      `;

      const params = [orderId];

      // Nếu có userId, chỉ lấy đơn hàng của user đó
      if (userId) {
        query += ` AND dh.ID_NguoiMua = ?`;
        params.push(userId);
      }

      const [rows] = await smartDB.execute(query, params);

      if (rows.length === 0) {
        return null;
      }

      const order = rows[0];

      // Lấy chi tiết các sản phẩm trong đơn hàng
      const [itemRows] = await smartDB.execute(
        `SELECT 
          ct.ID_SanPham as productId,
          ct.DonGia as price,
          ct.SoLuong as quantity,
          sp.TenSanPham as productName
        FROM chitietdonhang ct
        LEFT JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
        WHERE ct.ID_DonHang = ?`,
        [orderId]
      );

      order.items = itemRows;

      // Tính tổng tiền hàng (subtotal) từ các sản phẩm
      const subtotal = itemRows.reduce((sum, item) => {
        return sum + parseFloat(item.price) * parseInt(item.quantity);
      }, 0);

      // Phí vận chuyển mặc định
      const defaultShippingFee = 30000;

      // Kiểm tra xem có sử dụng voucher không
      const [voucherRows] = await smartDB.execute(
        `SELECT 
          apma.ID_ApMa,
          apma.SuDungLuc,
          pgm.MaGiam as voucherCode,
          pgm.PhanTramGiam as discountPercent,
          pgm.GiaTriDonHangToiThieu as minOrderValue
        FROM apma 
        LEFT JOIN phieugiamgia pgm ON apma.ID_Phieu = pgm.ID_Phieu
        WHERE apma.ID_DonHang = ?`,
        [orderId]
      );

      // Tính toán chi tiết đơn hàng
      let voucherDiscount = 0;
      let shippingFee = defaultShippingFee;

      if (voucherRows.length > 0) {
        const voucher = voucherRows[0];
        // Tính discount dựa trên phần trăm
        voucherDiscount = Math.floor(
          subtotal * (parseFloat(voucher.discountPercent) / 100)
        );

        order.voucher = {
          code: voucher.voucherCode,
          discountPercent: parseFloat(voucher.discountPercent),
          discountAmount: voucherDiscount,
          minOrderValue: parseFloat(voucher.minOrderValue || 0),
          usedAt: voucher.SuDungLuc,
        };
      }

      // // Miễn phí vận chuyển nếu đơn hàng >= 500k
      // if (subtotal >= 500000) {
      //   shippingFee = 0;
      // }

      // Thêm thông tin chi tiết vào order
      order.orderDetails = {
        subtotal: subtotal,
        shippingFee: shippingFee,
        voucherDiscount: voucherDiscount,
        totalBeforeDiscount: subtotal + shippingFee,
        finalTotal: parseFloat(order.totalAmount),
      };

      return order;
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting order:", error);
      throw error;
    }
  }

  // Hủy đơn hàng (cập nhật trạng thái thành cancelled)
  static async cancelOrder(orderId, userId = null) {
    try {
      console.log(
        `[ORDER_MODEL] Cancelling order ${orderId} for user ${
          userId || "admin"
        }`
      );

      // Kiểm tra đơn hàng có tồn tại và thuộc về user không (nếu có userId)
      let checkQuery = `SELECT ID_DonHang, ID_NguoiMua, TrangThai FROM donhang WHERE ID_DonHang = ?`;
      const checkParams = [orderId];

      if (userId) {
        checkQuery += ` AND ID_NguoiMua = ?`;
        checkParams.push(userId);
      }

      const [orderRows] = await smartDB.execute(checkQuery, checkParams);

      if (orderRows.length === 0) {
        return {
          success: false,
          message:
            "Không tìm thấy đơn hàng hoặc bạn không có quyền hủy đơn hàng này",
        };
      }

      const order = orderRows[0];

      // Kiểm tra trạng thái đơn hàng (chỉ cho phép hủy đơn hàng pending)
      if (order.TrangThai !== "pending") {
        return {
          success: false,
          message: "Chỉ có thể hủy đơn hàng đang chờ xác nhận",
        };
      }

      // Cập nhật trạng thái đơn hàng thành 'cancelled'
      await smartDB.execute(
        `UPDATE donhang SET TrangThai = 'cancelled' WHERE ID_DonHang = ?`,
        [orderId]
      );
      console.log(`[ORDER_MODEL] Updated order ${orderId} status to cancelled`);

      return {
        success: true,
        message: "Đơn hàng đã được hủy thành công",
        orderId: orderId,
      };
    } catch (error) {
      console.error(`[ORDER_MODEL] Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng của user
  static async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await smartDB.execute(
        `SELECT 
          dh.ID_DonHang as orderId,
          dh.TongGia as totalAmount,
          dh.ThoiGianTao as createdAt,
          dh.TrangThai as status,
          tt.PhuongThuc as paymentMethod,
          tt.TrangThai as paymentStatus,
          gh.TrangThai as deliveryStatus
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN giaohang gh ON dh.ID_DonHang = gh.ID_DonHang
        WHERE dh.ID_NguoiMua = ?
        ORDER BY dh.ThoiGianTao DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      // Đếm tổng số đơn hàng
      const [countRows] = await smartDB.execute(
        `SELECT COUNT(*) as total FROM donhang WHERE ID_NguoiMua = ?`,
        [userId]
      );

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        orders: rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalOrders: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting user orders:", error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng cho seller (các đơn hàng có sản phẩm của shop)
  static async getSellerOrders(sellerId, page = 1, limit = 10, status = null) {
    try {
      const offset = (page - 1) * limit;

      // Build query with optional status filter
      let statusCondition = "";
      let queryParams = [sellerId];

      if (status && status !== "all") {
        statusCondition = "AND dh.TrangThai = ?";
        queryParams.push(status);
      }

      // Add pagination params
      queryParams.push(limit, offset);

      const [rows] = await smartDB.execute(
        `SELECT DISTINCT
          dh.ID_DonHang as orderId,
          dh.ID_NguoiMua as buyerId,
          dh.TongGia as totalAmount,
          dh.ThoiGianTao as createdAt,
          dh.TrangThai as status,
          tt.PhuongThuc as paymentMethod,
          tt.TrangThai as paymentStatus,
          gh.DiaChi as shippingAddress,
          gh.TrangThai as deliveryStatus,
          nd.HoTen as buyerName,
          nd.SoDienThoai as buyerPhone,
          nd.Email as buyerEmail
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN giaohang gh ON dh.ID_DonHang = gh.ID_DonHang
        LEFT JOIN nguoidung nd ON dh.ID_NguoiMua = nd.ID_NguoiDung
        INNER JOIN chitietdonhang ct ON dh.ID_DonHang = ct.ID_DonHang
        INNER JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
        WHERE sp.ID_NguoiBan = ? ${statusCondition}
        ORDER BY dh.ThoiGianTao DESC
        LIMIT ? OFFSET ?`,
        queryParams
      );

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(DISTINCT dh.ID_DonHang) as total
        FROM donhang dh
        INNER JOIN chitietdonhang ct ON dh.ID_DonHang = ct.ID_DonHang
        INNER JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
        WHERE sp.ID_NguoiBan = ? ${statusCondition}
      `;

      let countParams = [sellerId];
      if (status && status !== "all") {
        countParams.push(status);
      }

      const [countRows] = await smartDB.execute(countQuery, countParams);
      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      // Get order items for each order
      for (let order of rows) {
        const [itemRows] = await smartDB.execute(
          `SELECT 
            ct.ID_SanPham as productId,
            ct.DonGia as price,
            ct.SoLuong as quantity,
            sp.TenSanPham as productName,
            asp.Url as productImage
          FROM chitietdonhang ct
          INNER JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
          LEFT JOIN anhsanpham asp ON sp.ID_SanPham = asp.ID_SanPham
          WHERE ct.ID_DonHang = ? AND sp.ID_NguoiBan = ?
          GROUP BY ct.ID_SanPham
          ORDER BY ct.ID_ChiTietDH`,
          [order.orderId, sellerId]
        );

        order.items = itemRows;

        // Calculate seller's revenue from this order (only products from this seller)
        order.sellerRevenue = itemRows.reduce((sum, item) => {
          return sum + parseFloat(item.price) * parseInt(item.quantity);
        }, 0);
      }

      return {
        orders: rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalOrders: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting seller orders:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng (cho seller)
  static async updateOrderStatus(orderId, newStatus, sellerId = null) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[ORDER_MODEL] Updating order ${orderId} status to ${newStatus} by seller ${
          sellerId || "admin"
        }`
      );

      // Validate status
      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(newStatus)) {
        await connection.rollback();
        return {
          success: false,
          message: "Trạng thái đơn hàng không hợp lệ",
        };
      }

      // If sellerId is provided, check if seller has products in this order
      if (sellerId) {
        const [checkRows] = await connection.execute(
          `SELECT COUNT(*) as count
           FROM donhang dh
           INNER JOIN chitietdonhang ct ON dh.ID_DonHang = ct.ID_DonHang
           INNER JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
           WHERE dh.ID_DonHang = ? AND sp.ID_NguoiBan = ?`,
          [orderId, sellerId]
        );

        if (checkRows[0].count === 0) {
          await connection.rollback();
          return {
            success: false,
            message: "Bạn không có quyền cập nhật đơn hàng này",
          };
        }
      }

      // Check current order status WITH ROW LOCK to prevent race conditions
      const [orderRows] = await connection.execute(
        `SELECT TrangThai FROM donhang WHERE ID_DonHang = ? FOR UPDATE`,
        [orderId]
      );

      if (orderRows.length === 0) {
        await connection.rollback();
        return {
          success: false,
          message: "Không tìm thấy đơn hàng",
        };
      }

      const currentStatus = orderRows[0].TrangThai;
      console.log(
        `[ORDER_MODEL] Current status: ${currentStatus}, Target status: ${newStatus}`
      );

      // Business logic for status transitions
      const statusTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped"],
        shipped: ["delivered"],
        delivered: [], // Final state
        cancelled: [], // Final state
      };

      // Allow idempotent operations (setting the same status)
      if (currentStatus === newStatus) {
        console.log(
          `[ORDER_MODEL] Idempotent operation detected: ${currentStatus} -> ${newStatus}`
        );
        await connection.commit();
        return {
          success: true,
          message: "Trạng thái đơn hàng không thay đổi",
          orderId: orderId,
          oldStatus: currentStatus,
          newStatus: newStatus,
        };
      }

      if (
        !statusTransitions[currentStatus] ||
        !statusTransitions[currentStatus].includes(newStatus)
      ) {
        console.log(
          `[ORDER_MODEL] Invalid transition: ${currentStatus} -> ${newStatus}`
        );
        console.log(
          `[ORDER_MODEL] Valid transitions for ${currentStatus}:`,
          statusTransitions[currentStatus]
        );
        await connection.rollback();
        return {
          success: false,
          message: `Không thể chuyển từ trạng thái "${currentStatus}" sang "${newStatus}"`,
        };
      }

      // Update order status
      await connection.execute(
        `UPDATE donhang SET TrangThai = ? WHERE ID_DonHang = ?`,
        [newStatus, orderId]
      );

      // Update delivery status if needed
      if (newStatus === "shipped") {
        await connection.execute(
          `UPDATE giaohang SET TrangThai = 'out_for_delivery', NgayVanChuyen = NOW() WHERE ID_DonHang = ?`,
          [orderId]
        );
      } else if (newStatus === "delivered") {
        await connection.execute(
          `UPDATE giaohang SET TrangThai = 'delivered', NgayGiaoToi = NOW() WHERE ID_DonHang = ?`,
          [orderId]
        );
      }

      await connection.commit();
      console.log(
        `[ORDER_MODEL] Successfully updated order ${orderId} from ${currentStatus} to ${newStatus}`
      );

      return {
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công",
        orderId: orderId,
        oldStatus: currentStatus,
        newStatus: newStatus,
      };
    } catch (error) {
      await connection.rollback();
      console.error(
        `[ORDER_MODEL] Error updating order status for order ${orderId}:`,
        error
      );
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default OrderModel;
