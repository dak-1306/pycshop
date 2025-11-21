import smartDB from "../../db/index.js";
import notificationHelper from "../helpers/NotificationHelper.js";

class OrderModel {
  // Tạo đơn hàng mới với transaction - tách theo người bán
  static async createOrder(orderData) {
    const connection = await smartDB.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[ORDER_MODEL] Starting transaction for user ${orderData.userId}`
      );

      const { userId, items, shippingAddress, paymentMethod, totalAmount } =
        orderData;

      // 1. Lấy thông tin người bán cho từng sản phẩm
      const productIds = items.map((item) => item.productId);
      const placeholders = productIds.map(() => "?").join(",");

      const [sellerData] = await connection.execute(
        `SELECT ID_SanPham, ID_NguoiBan FROM sanpham WHERE ID_SanPham IN (${placeholders})`,
        productIds
      );

      // 2. Nhóm sản phẩm theo người bán
      const sellerGroups = {};
      items.forEach((item) => {
        const productInfo = sellerData.find(
          (p) => p.ID_SanPham == item.productId
        );
        if (productInfo) {
          const sellerId = productInfo.ID_NguoiBan;
          if (!sellerGroups[sellerId]) {
            sellerGroups[sellerId] = [];
          }
          sellerGroups[sellerId].push(item);
        }
      });

      console.log(
        `[ORDER_MODEL] Found ${
          Object.keys(sellerGroups).length
        } different sellers`
      );

      const createdOrders = [];
      const paymentMethodMap = {
        cod: "COD",
        bank_transfer: "CBS",
        momo: "CBS",
        zalopay: "CBS",
      };
      const dbPaymentMethod = paymentMethodMap[paymentMethod] || "COD";
      const paymentStatus = paymentMethod === "cod" ? "unpaid" : "paid";

      // 3. Tạo đơn hàng riêng cho từng người bán
      for (const [sellerId, sellerItems] of Object.entries(sellerGroups)) {
        // Tính tổng tiền cho đơn hàng của seller này
        const sellerTotal = sellerItems.reduce((sum, item) => {
          return sum + parseFloat(item.price) * parseInt(item.quantity);
        }, 0);

        console.log(
          `[ORDER_MODEL] Creating order for seller ${sellerId} with total: ${sellerTotal}`
        );

        // Tạo đơn hàng cho seller này
        const [orderResult] = await connection.execute(
          `INSERT INTO donhang (ID_NguoiMua, TongGia, TrangThai, ThoiGianTao)
           VALUES (?, ?, 'pending', NOW())`,
          [userId, sellerTotal]
        );

        const orderId = orderResult.insertId;
        console.log(
          `[ORDER_MODEL] Created order ID: ${orderId} for seller ${sellerId}`
        );

        // Thêm chi tiết đơn hàng
        for (const item of sellerItems) {
          await connection.execute(
            `INSERT INTO chitietdonhang (ID_DonHang, ID_SanPham, DonGia, SoLuong)
             VALUES (?, ?, ?, ?)`,
            [orderId, item.productId, item.price, item.quantity]
          );
          console.log(
            `[ORDER_MODEL] Added item to order ${orderId}: Product ${item.productId} x${item.quantity}`
          );
        }

        // Tạo thông tin thanh toán
        await connection.execute(
          `INSERT INTO thanhtoan (ID_DonHang, PhuongThuc, TrangThai, ThoiGianTao)
           VALUES (?, ?, ?, NOW())`,
          [orderId, dbPaymentMethod, paymentStatus]
        );
        console.log(
          `[ORDER_MODEL] Created payment record for order ${orderId}: ${dbPaymentMethod}`
        );

        // Tạo thông tin giao hàng
        await connection.execute(
          `INSERT INTO giaohang (ID_DonHang, DiaChi, TrangThai)
           VALUES (?, ?, 'undelivery')`,
          [orderId, shippingAddress]
        );
        console.log(
          `[ORDER_MODEL] Created delivery record for order ${orderId}`
        );

        createdOrders.push({
          orderId: orderId,
          sellerId: sellerId,
          items: sellerItems,
          total: sellerTotal,
        });
      }

      // Commit transaction
      await connection.commit();
      console.log(
        `[ORDER_MODEL] Transaction committed successfully - Created ${createdOrders.length} orders`
      );

      // Send notifications asynchronously
      createdOrders.forEach((order) => {
        // Send notification to buyer for each order
        notificationHelper
          .createOrderNotification(userId, order.orderId, "pending")
          .then((result) => {
            if (result.success) {
              console.log(
                `[ORDER_MODEL] ✅ Order creation notification sent successfully for order ${order.orderId}`
              );
            } else {
              console.log(
                `[ORDER_MODEL] ⚠️ Failed to send order creation notification for order ${order.orderId}: ${result.message}`
              );
            }
          })
          .catch((error) => {
            console.error(
              `[ORDER_MODEL] ❌ Error sending order creation notification for order ${order.orderId}:`,
              error.message
            );
          });

        // Send notification to seller
        this.notifySellersAboutNewOrder(order.orderId, userId, order.items)
          .then((results) => {
            console.log(
              `[ORDER_MODEL] ✅ Seller notifications process completed for order ${order.orderId}`
            );
          })
          .catch((error) => {
            console.error(
              `[ORDER_MODEL] ❌ Error in seller notification process for order ${order.orderId}:`,
              error.message
            );
          });
      });

      return {
        success: true,
        orders: createdOrders.map((order) => ({
          orderId: order.orderId,
          sellerId: order.sellerId,
          total: order.total,
          itemCount: order.items.length,
        })),
        totalOrders: createdOrders.length,
        message: `Successfully created ${createdOrders.length} orders`,
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

      // Send cancellation notification asynchronously
      const buyerId = userId || order.ID_NguoiMua;
      notificationHelper
        .createOrderNotification(buyerId, orderId, "cancelled")
        .then((result) => {
          if (result.success) {
            console.log(
              `[ORDER_MODEL] ✅ Order cancellation notification sent successfully for order ${orderId}`
            );
          } else {
            console.log(
              `[ORDER_MODEL] ⚠️ Failed to send order cancellation notification for order ${orderId}: ${result.message}`
            );
          }
        })
        .catch((error) => {
          console.error(
            `[ORDER_MODEL] ❌ Error sending order cancellation notification for order ${orderId}:`,
            error.message
          );
        });

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

      // Get buyer ID to send notification
      const [buyerRows] = await smartDB.execute(
        `SELECT ID_NguoiMua FROM donhang WHERE ID_DonHang = ?`,
        [orderId]
      );

      if (buyerRows.length > 0) {
        const buyerId = buyerRows[0].ID_NguoiMua;
        // Send notification asynchronously (don't wait for it to complete)
        notificationHelper
          .createOrderNotification(buyerId, orderId, newStatus)
          .then((result) => {
            if (result.success) {
              console.log(
                `[ORDER_MODEL] ✅ Notification sent successfully for order ${orderId}`
              );
            } else {
              console.log(
                `[ORDER_MODEL] ⚠️ Failed to send notification for order ${orderId}: ${result.message}`
              );
            }
          })
          .catch((error) => {
            console.error(
              `[ORDER_MODEL] ❌ Error sending notification for order ${orderId}:`,
              error.message
            );
          });
      }

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

  // Gửi thông báo cho tất cả người bán có sản phẩm trong đơn hàng
  static async notifySellersAboutNewOrder(orderId, buyerId, items) {
    try {
      console.log(
        `[ORDER_MODEL] Starting seller notification process for order ${orderId}`
      );

      // Lấy thông tin người mua
      const [buyerRows] = await smartDB.execute(
        `SELECT HoTen FROM nguoidung WHERE ID_NguoiDung = ?`,
        [buyerId]
      );
      const buyerName = buyerRows.length > 0 ? buyerRows[0].HoTen : null;

      // Lấy danh sách người bán duy nhất từ các sản phẩm trong đơn hàng
      const productIds = items.map((item) => item.productId);
      const placeholders = productIds.map(() => "?").join(",");

      const [sellerRows] = await smartDB.execute(
        `SELECT DISTINCT sp.ID_NguoiBan as sellerId, nd.HoTen as sellerName
         FROM sanpham sp 
         LEFT JOIN nguoidung nd ON sp.ID_NguoiBan = nd.ID_NguoiDung
         WHERE sp.ID_SanPham IN (${placeholders})`,
        productIds
      );

      console.log(
        `[ORDER_MODEL] Found ${sellerRows.length} sellers to notify for order ${orderId}`
      );

      // Gửi thông báo cho mỗi người bán
      const notificationPromises = sellerRows.map(async (seller) => {
        try {
          // Lấy các sản phẩm của seller này trong đơn hàng
          const sellerProducts = items.filter((item) => {
            // Tìm sản phẩm thuộc về seller này
            return productIds.includes(item.productId);
          });

          // Lấy thông tin chi tiết sản phẩm của seller này
          const [sellerProductDetails] = await smartDB.execute(
            `SELECT sp.TenSanPham, ct.SoLuong, ct.DonGia
             FROM sanpham sp
             JOIN chitietdonhang ct ON sp.ID_SanPham = ct.ID_SanPham
             WHERE ct.ID_DonHang = ? AND sp.ID_NguoiBan = ?`,
            [orderId, seller.sellerId]
          );

          // Tạo message chi tiết với thông tin sản phẩm
          let productList = sellerProductDetails
            .map((p) => `${p.TenSanPham} (x${p.SoLuong})`)
            .join(", ");

          const customMessage = `Bạn có đơn hàng mới #${orderId}${
            buyerName ? ` từ khách hàng ${buyerName}` : ""
          }.\nSản phẩm: ${productList}\nVui lòng xác nhận đơn hàng sớm nhất có thể.`;

          const result = await notificationHelper.createSellerNotification(
            seller.sellerId,
            orderId,
            buyerName,
            customMessage
          );

          if (result.success) {
            console.log(
              `[ORDER_MODEL] ✅ Notification sent to seller ${
                seller.sellerName || seller.sellerId
              } for order ${orderId}`
            );
          } else {
            console.log(
              `[ORDER_MODEL] ⚠️ Failed to send notification to seller ${
                seller.sellerName || seller.sellerId
              }: ${result.message}`
            );
          }

          return result;
        } catch (error) {
          console.error(
            `[ORDER_MODEL] ❌ Error sending notification to seller ${seller.sellerId}:`,
            error.message
          );
          return {
            success: false,
            error: error.message,
            sellerId: seller.sellerId,
          };
        }
      });

      // Đợi tất cả notifications được gửi
      const results = await Promise.allSettled(notificationPromises);

      const successCount = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const totalCount = results.length;

      console.log(
        `[ORDER_MODEL] Seller notifications completed: ${successCount}/${totalCount} successful for order ${orderId}`
      );

      return {
        success: true,
        totalSellers: totalCount,
        successfulNotifications: successCount,
        results: results,
      };
    } catch (error) {
      console.error(
        `[ORDER_MODEL] ❌ Error in seller notification process for order ${orderId}:`,
        error
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Lấy danh sách seller IDs từ order
  static async getSellerIdsByOrderId(orderId) {
    try {
      const [rows] = await smartDB.execute(
        `SELECT DISTINCT sp.ID_NguoiBan as sellerId
         FROM chitietdonhang ct
         INNER JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
         WHERE ct.ID_DonHang = ?`,
        [orderId]
      );

      return rows.map((row) => row.sellerId);
    } catch (error) {
      console.error(
        `[ORDER_MODEL] Error getting seller IDs for order ${orderId}:`,
        error
      );
      return [];
    }
  }
}

export default OrderModel;
