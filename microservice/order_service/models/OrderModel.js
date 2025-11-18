import smartDB from "../../db/index.js";

class OrderModel {
  // Tạo đơn hàng mới với transaction
  static async createOrder(orderData) {
    const connection = await smartDB.getConnection();

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
        voucher,
      } = orderData;

      console.log(`[ORDER_MODEL] Creating order for user ${userId}`);

      // 1. Tạo đơn hàng chính
      const [orderResult] = await connection.execute(
        `INSERT INTO donhang 
         (ID_NguoiDung, TrangThai, GhiChu, NgayDat, TongTien, PhiVanChuyen, GiamGia, ThanhTien)
         VALUES (?, 'pending', ?, NOW(), ?, ?, ?, ?)`,
        [
          userId,
          note || "",
          subtotal,
          shippingFee || 0,
          voucherDiscount || 0,
          total,
        ]
      );

      const orderId = orderResult.insertId;
      console.log(`[ORDER_MODEL] Created order with ID: ${orderId}`);

      // 2. Tạo chi tiết đơn hàng
      for (const item of items) {
        await connection.execute(
          `INSERT INTO chitietdonhang 
           (ID_DonHang, ID_SanPham, SoLuong, Gia, ThanhTien)
           VALUES (?, ?, ?, ?, ?)`,
          [
            orderId,
            item.id,
            item.quantity,
            item.price,
            item.price * item.quantity,
          ]
        );
      }

      console.log(`[ORDER_MODEL] Added ${items.length} items to order`);

      // 3. Tạo thông tin thanh toán
      const paymentStatus = paymentMethod === "cod" ? "pending" : "waiting";

      const [paymentResult] = await connection.execute(
        `INSERT INTO thanhtoan 
         (ID_DonHang, PhuongThucThanhToan, TrangThai, SoTien, NgayThanhToan)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          paymentMethod,
          paymentStatus,
          total,
          paymentMethod === "cod" ? null : "NOW()",
        ]
      );

      console.log(
        `[ORDER_MODEL] Created payment record with ID: ${paymentResult.insertId}`
      );

      // 4. Tạo thông tin giao hàng
      const [deliveryResult] = await connection.execute(
        `INSERT INTO giaohang 
         (ID_DonHang, TenNguoiNhan, SoDienThoai, DiaChi, TinhThanh, QuanHuyen, PhuongXa, TrangThai)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'preparing')`,
        [
          orderId,
          address.name,
          address.phone,
          address.street,
          address.city || "",
          address.district || "",
          address.ward || "",
        ]
      );

      console.log(
        `[ORDER_MODEL] Created delivery record with ID: ${deliveryResult.insertId}`
      );

      await connection.commit();

      return {
        success: true,
        orderId: orderId,
        paymentId: paymentResult.insertId,
        deliveryId: deliveryResult.insertId,
        message: "Đơn hàng được tạo thành công",
      };
    } catch (error) {
      await connection.rollback();
      console.error("[ORDER_MODEL] Error creating order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy danh sách đơn hàng của user
  static async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const [orders] = await smartDB.executeRead(
        `SELECT 
          dh.ID_DonHang,
          dh.TrangThai,
          dh.NgayDat,
          dh.TongTien,
          dh.PhiVanChuyen,
          dh.GiamGia,
          dh.ThanhTien,
          dh.GhiChu,
          tt.PhuongThucThanhToan,
          tt.TrangThai as TrangThaiThanhToan,
          gh.TenNguoiNhan,
          gh.SoDienThoai,
          gh.DiaChi,
          gh.TrangThai as TrangThaiGiaoHang
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN giaohang gh ON dh.ID_DonHang = gh.ID_DonHang
        WHERE dh.ID_NguoiDung = ?
        ORDER BY dh.NgayDat DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      // Lấy chi tiết sản phẩm cho mỗi đơn hàng
      for (let order of orders) {
        const [items] = await smartDB.executeRead(
          `SELECT 
            ct.ID_SanPham,
            ct.SoLuong,
            ct.Gia,
            ct.ThanhTien,
            sp.TenSanPham,
            sp.HinhAnh
          FROM chitietdonhang ct
          LEFT JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
          WHERE ct.ID_DonHang = ?`,
          [order.ID_DonHang]
        );

        order.items = items;
      }

      return {
        success: true,
        orders: orders,
        pagination: {
          page,
          limit,
          total: orders.length,
        },
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting user orders:", error);
      throw error;
    }
  }

  // Lấy chi tiết đơn hàng
  static async getOrderById(orderId, userId = null) {
    try {
      let query = `
        SELECT 
          dh.ID_DonHang,
          dh.ID_NguoiDung,
          dh.TrangThai,
          dh.NgayDat,
          dh.TongTien,
          dh.PhiVanChuyen,
          dh.GiamGia,
          dh.ThanhTien,
          dh.GhiChu,
          tt.PhuongThucThanhToan,
          tt.TrangThai as TrangThaiThanhToan,
          tt.NgayThanhToan,
          gh.TenNguoiNhan,
          gh.SoDienThoai,
          gh.DiaChi,
          gh.TinhThanh,
          gh.QuanHuyen,
          gh.PhuongXa,
          gh.TrangThai as TrangThaiGiaoHang,
          gh.NgayGiao
        FROM donhang dh
        LEFT JOIN thanhtoan tt ON dh.ID_DonHang = tt.ID_DonHang
        LEFT JOIN giaohang gh ON dh.ID_DonHang = gh.ID_DonHang
        WHERE dh.ID_DonHang = ?`;

      let params = [orderId];

      if (userId) {
        query += ` AND dh.ID_NguoiDung = ?`;
        params.push(userId);
      }

      const [orderRows] = await smartDB.executeRead(query, params);

      if (orderRows.length === 0) {
        return null;
      }

      const order = orderRows[0];

      // Lấy chi tiết sản phẩm
      const [items] = await smartDB.executeRead(
        `SELECT 
          ct.ID_SanPham,
          ct.SoLuong,
          ct.Gia,
          ct.ThanhTien,
          sp.TenSanPham,
          sp.HinhAnh,
          sp.MoTa
        FROM chitietdonhang ct
        LEFT JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
        WHERE ct.ID_DonHang = ?`,
        [orderId]
      );

      order.items = items;

      return {
        success: true,
        order: order,
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting order by ID:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(orderId, status, userId = null) {
    try {
      let query = `UPDATE donhang SET TrangThai = ? WHERE ID_DonHang = ?`;
      let params = [status, orderId];

      if (userId) {
        query += ` AND ID_NguoiDung = ?`;
        params.push(userId);
      }

      const [result] = await smartDB.executeWrite(query, params);

      if (result.affectedRows > 0) {
        console.log(
          `[ORDER_MODEL] Updated order ${orderId} status to ${status}`
        );
        return {
          success: true,
          message: "Cập nhật trạng thái thành công",
        };
      } else {
        return {
          success: false,
          message: "Không tìm thấy đơn hàng hoặc không có quyền cập nhật",
        };
      }
    } catch (error) {
      console.error("[ORDER_MODEL] Error updating order status:", error);
      throw error;
    }
  }

  // Hủy đơn hàng
  static async cancelOrder(orderId, userId, reason = null) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();

      // Kiểm tra đơn hàng có thể hủy không
      const [orderRows] = await connection.execute(
        `SELECT TrangThai FROM donhang 
         WHERE ID_DonHang = ? AND ID_NguoiDung = ?`,
        [orderId, userId]
      );

      if (orderRows.length === 0) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      const currentStatus = orderRows[0].TrangThai;

      if (!["pending", "confirmed"].includes(currentStatus)) {
        throw new Error("Đơn hàng không thể hủy ở trạng thái hiện tại");
      }

      // Cập nhật trạng thái đơn hàng
      await connection.execute(
        `UPDATE donhang SET TrangThai = 'cancelled' WHERE ID_DonHang = ?`,
        [orderId]
      );

      // Cập nhật trạng thái thanh toán nếu cần
      await connection.execute(
        `UPDATE thanhtoan SET TrangThai = 'cancelled' WHERE ID_DonHang = ?`,
        [orderId]
      );

      // Cập nhật trạng thái giao hàng
      await connection.execute(
        `UPDATE giaohang SET TrangThai = 'cancelled' WHERE ID_DonHang = ?`,
        [orderId]
      );

      await connection.commit();

      return {
        success: true,
        message: "Hủy đơn hàng thành công",
      };
    } catch (error) {
      await connection.rollback();
      console.error("[ORDER_MODEL] Error cancelling order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy thống kê đơn hàng (cho admin)
  static async getOrderStatistics(fromDate = null, toDate = null) {
    try {
      let whereClause = "";
      let params = [];

      if (fromDate && toDate) {
        whereClause = "WHERE DATE(NgayDat) BETWEEN ? AND ?";
        params = [fromDate, toDate];
      }

      const [stats] = await smartDB.executeRead(
        `SELECT 
          COUNT(*) as totalOrders,
          SUM(CASE WHEN TrangThai = 'pending' THEN 1 ELSE 0 END) as pendingOrders,
          SUM(CASE WHEN TrangThai = 'confirmed' THEN 1 ELSE 0 END) as confirmedOrders,
          SUM(CASE WHEN TrangThai = 'shipping' THEN 1 ELSE 0 END) as shippingOrders,
          SUM(CASE WHEN TrangThai = 'delivered' THEN 1 ELSE 0 END) as deliveredOrders,
          SUM(CASE WHEN TrangThai = 'cancelled' THEN 1 ELSE 0 END) as cancelledOrders,
          SUM(ThanhTien) as totalRevenue,
          AVG(ThanhTien) as averageOrderValue
        FROM donhang ${whereClause}`,
        params
      );

      return {
        success: true,
        statistics: stats[0],
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting order statistics:", error);
      throw error;
    }
  }

  // Lấy tất cả đơn hàng (cho admin)
  static async getAllOrders(page = 1, limit = 20, status = null) {
    try {
      const offset = (page - 1) * limit;

      let whereClause = "";
      let params = [];

      if (status) {
        whereClause = "WHERE dh.TrangThai = ?";
        params.push(status);
      }

      const [orders] = await smartDB.executeRead(
        `SELECT 
          dh.ID_DonHang,
          dh.ID_NguoiDung,
          dh.TrangThai,
          dh.NgayDat,
          dh.TongTien,
          dh.PhiVanChuyen,
          dh.GiamGia,
          dh.ThanhTien,
          nd.TenNguoiDung,
          nd.Email,
          COUNT(ct.ID_SanPham) as SoLuongSanPham
        FROM donhang dh
        LEFT JOIN nguoidung nd ON dh.ID_NguoiDung = nd.ID_NguoiDung
        LEFT JOIN chitietdonhang ct ON dh.ID_DonHang = ct.ID_DonHang
        ${whereClause}
        GROUP BY dh.ID_DonHang
        ORDER BY dh.NgayDat DESC
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      // Đếm tổng số đơn hàng
      const [countResult] = await smartDB.executeRead(
        `SELECT COUNT(*) as total FROM donhang dh ${whereClause}`,
        params
      );

      return {
        success: true,
        orders: orders,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit),
        },
      };
    } catch (error) {
      console.error("[ORDER_MODEL] Error getting all orders:", error);
      throw error;
    }
  }
}

export default OrderModel;
