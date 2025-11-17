import { pool } from "../db/mysql.js";

export class OrderModel {
  // Tạo đơn hàng mới
  static async createOrder(orderData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        userId,
        items,
        address,
        paymentMethod,
        note,
        subtotal,
        shippingFee,
        voucherDiscount,
        total,
      } = orderData;

      // 1. Tạo đơn hàng trong bảng donhang
      const [orderResult] = await connection.query(
        `INSERT INTO donhang (ID_NguoiMua, TongGia, TrangThai) 
         VALUES (?, ?, 'pending')`,
        [userId, total]
      );

      const orderId = orderResult.insertId;
      console.log(`[ORDER_MODEL] Created order ${orderId} for user ${userId}`);

      // 2. Thêm chi tiết đơn hàng vào bảng chitietdonhang
      for (const item of items) {
        await connection.query(
          `INSERT INTO chitietdonhang (ID_DonHang, ID_SanPham, DonGia, SoLuong)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.id, item.price, item.quantity]
        );

        console.log(`[ORDER_MODEL] Added item ${item.id} to order ${orderId}`);
      }

      // 3. Tạo bản ghi thanh toán trong bảng thanhtoan
      const paymentMethodMap = {
        cod: "COD",
        bank_transfer: "CBS",
        momo: "CBS",
        zalopay: "CBS",
      };

      const dbPaymentMethod = paymentMethodMap[paymentMethod] || "COD";
      const paymentStatus = paymentMethod === "cod" ? "unpaid" : "unpaid"; // COD sẽ unpaid cho đến khi giao hàng

      await connection.query(
        `INSERT INTO thanhtoan (ID_DonHang, PhuongThuc, TrangThai)
         VALUES (?, ?, ?)`,
        [orderId, dbPaymentMethod, paymentStatus]
      );

      console.log(`[ORDER_MODEL] Created payment record for order ${orderId}`);

      // 4. Tạo bản ghi giao hàng trong bảng giaohang
      const fullAddress = `${address.name}, ${address.phone}\n${address.street}, ${address.ward}, ${address.district}, ${address.city}`;

      await connection.query(
        `INSERT INTO giaohang (ID_DonHang, DiaChi, TrangThai)
         VALUES (?, ?, 'undelivery')`,
        [orderId, fullAddress]
      );

      console.log(`[ORDER_MODEL] Created delivery record for order ${orderId}`);

      // 5. Cập nhật số lượng tồn kho (tùy chọn - nếu có bảng inventory)
      // Có thể thêm logic cập nhật stock ở đây

      await connection.commit();

      return {
        success: true,
        orderId: orderId,
        message: "Đơn hàng đã được tạo thành công",
      };
    } catch (error) {
      await connection.rollback();
      console.error("[ORDER_MODEL] Error creating order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy thông tin đơn hàng theo ID
  static async getOrderById(orderId, userId = null) {
    const connection = await pool.getConnection();

    try {
      // Query để lấy thông tin đơn hàng
      let whereClause = "WHERE dh.ID_DonHang = ?";
      let params = [orderId];

      if (userId) {
        whereClause += " AND dh.ID_NguoiMua = ?";
        params.push(userId);
      }

      const [orderRows] = await connection.query(
        `SELECT 
          dh.ID_DonHang,
          dh.ID_NguoiMua,
          dh.TongGia,
          dh.ThoiGianTao,
          dh.TrangThai,
          tt.PhuongThuc as PaymentMethod,
          tt.TrangThai as PaymentStatus,
          gh.DiaChi,
          gh.TrangThai as DeliveryStatus,
          gh.NgayVanChuyen
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN giaohang gh ON dh.ID_DonHang = gh.ID_DonHang
        ${whereClause}`,
        params
      );

      if (orderRows.length === 0) {
        return null;
      }

      const order = orderRows[0];

      // Lấy chi tiết sản phẩm trong đơn hàng
      const [itemRows] = await connection.query(
        `SELECT 
          ctdh.ID_ChiTietDH,
          ctdh.ID_SanPham,
          ctdh.DonGia,
          ctdh.SoLuong,
          sp.TenSanPham,
          sp.MoTa,
          (SELECT MIN(anh.Url) FROM AnhSanPham anh WHERE anh.ID_SanPham = sp.ID_SanPham) as ProductImage
        FROM chitietdonhang ctdh
        LEFT JOIN sanpham sp ON ctdh.ID_SanPham = sp.ID_SanPham
        WHERE ctdh.ID_DonHang = ?`,
        [orderId]
      );

      return {
        ...order,
        items: itemRows,
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy danh sách đơn hàng của người dùng
  static async getUserOrders(userId, page = 1, limit = 10) {
    const connection = await pool.getConnection();

    try {
      const offset = (page - 1) * limit;

      const [orderRows] = await connection.query(
        `SELECT 
          dh.ID_DonHang,
          dh.TongGia,
          dh.ThoiGianTao,
          dh.TrangThai,
          tt.PhuongThuc as PaymentMethod,
          tt.TrangThai as PaymentStatus,
          COUNT(ctdh.ID_ChiTietDH) as TotalItems
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN chitietdonhang ctdh ON dh.ID_DonHang = ctdh.ID_DonHang
        WHERE dh.ID_NguoiMua = ?
        GROUP BY dh.ID_DonHang
        ORDER BY dh.ThoiGianTao DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      // Đếm tổng số đơn hàng
      const [countRows] = await connection.query(
        "SELECT COUNT(*) as total FROM donhang WHERE ID_NguoiMua = ?",
        [userId]
      );

      return {
        orders: orderRows,
        pagination: {
          page: page,
          limit: limit,
          total: countRows[0].total,
          totalPages: Math.ceil(countRows[0].total / limit),
        },
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting user orders:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(orderId, status, userId = null) {
    const connection = await pool.getConnection();

    try {
      let whereClause = "WHERE ID_DonHang = ?";
      let params = [status, orderId];

      if (userId) {
        whereClause += " AND ID_NguoiMua = ?";
        params.push(userId);
      }

      const [result] = await connection.query(
        `UPDATE donhang SET TrangThai = ? ${whereClause}`,
        params
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("[ORDER_MODEL] Error updating order status:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cập nhật trạng thái thanh toán
  static async updatePaymentStatus(orderId, status) {
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query(
        "UPDATE thanhtoan SET TrangThai = ? WHERE ID_DonHang = ?",
        [status, orderId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("[ORDER_MODEL] Error updating payment status:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Hủy đơn hàng
  static async cancelOrder(orderId, userId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Kiểm tra xem đơn hàng có thể hủy không (chỉ pending hoặc confirmed)
      const [orderRows] = await connection.query(
        "SELECT TrangThai FROM donhang WHERE ID_DonHang = ? AND ID_NguoiMua = ?",
        [orderId, userId]
      );

      if (orderRows.length === 0) {
        throw new Error("Đơn hàng không tồn tại");
      }

      const currentStatus = orderRows[0].TrangThai;
      if (currentStatus === "shipped" || currentStatus === "cancelled") {
        throw new Error("Không thể hủy đơn hàng này");
      }

      // Cập nhật trạng thái đơn hàng thành cancelled
      await connection.query(
        "UPDATE donhang SET TrangThai = 'cancelled' WHERE ID_DonHang = ?",
        [orderId]
      );

      console.log(`[ORDER_MODEL] Cancelled order ${orderId}`);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("[ORDER_MODEL] Error cancelling order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default OrderModel;
