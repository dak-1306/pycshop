import db from "../../../db/index.js";

class Seller {
  // Get seller's products with pagination
  static async getSellerProducts({
    sellerId,
    page = 1,
    limit = 20,
    search = null,
    status = null,
    sortBy = "created_date",
    sortOrder = "DESC",
  }) {
    try {
      const offset = (page - 1) * limit;
      let whereConditions = ["p.ID_NguoiBan = ?"];
      let params = [sellerId];

      // Search filter
      if (search) {
        whereConditions.push("(p.TenSanPham LIKE ? OR p.MoTa LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
      }

      // Status filter
      if (status) {
        whereConditions.push("p.TrangThai = ?");
        params.push(status);
      }

      // Build WHERE clause
      const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

      // Valid sort columns
      const sortColumnMap = {
        created_date: "CapNhat",
        TenSanPham: "TenSanPham",
        Gia: "Gia",
        TonKho: "TonKho",
      };

      const finalSortBy =
        sortColumnMap[sortBy] || sortColumnMap["created_date"];
      const finalSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : "DESC";

      // Main query
      const query = `
        SELECT 
          p.ID_SanPham,
          p.TenSanPham,
          p.MoTa,
          p.Gia,
          p.TonKho,
          p.TrangThai,
          GROUP_CONCAT(a.Url) as image_urls,
          p.CapNhat as created_date,
          dm.TenDanhMuc,
          dm.ID_DanhMuc,
          c.TenCuaHang
        FROM SanPham p
        LEFT JOIN nguoidung n ON p.ID_NguoiBan = n.ID_NguoiDung
        LEFT JOIN cuahang c ON n.ID_CuaHang = c.ID_CuaHang
        LEFT JOIN danhmuc dm ON p.ID_DanhMuc = dm.ID_DanhMuc
        LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
        ${whereClause}
        GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, dm.TenDanhMuc, dm.ID_DanhMuc, c.TenCuaHang
        ORDER BY p.${finalSortBy} ${finalSortOrder}
        LIMIT ? OFFSET ?
      `;

      // Add pagination params
      params.push(limit, offset);

      const [rows] = await db.execute(query, params);

      // Count total for pagination
      const countQuery = `
        SELECT COUNT(DISTINCT p.ID_SanPham) as total
        FROM SanPham p
        LEFT JOIN nguoidung n ON p.ID_NguoiBan = n.ID_NguoiDung
        LEFT JOIN cuahang c ON n.ID_CuaHang = c.ID_CuaHang
        ${whereClause}
      `;

      const countParams = params.slice(0, -2); // Remove limit and offset
      const [countResult] = await db.execute(countQuery, countParams);
      const total = countResult[0].total;

      const totalPages = Math.ceil(total / limit);

      return {
        products: rows,
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
      console.error("[SELLER] Error in getSellerProducts:", error);
      throw error;
    }
  }

  // Add new product
  static async addProduct(sellerId, productData) {
    try {
      // Check if seller has shop
      const shopQuery =
        "SELECT ID_CuaHang FROM nguoidung WHERE ID_NguoiDung = ?";
      const [shopRows] = await db.execute(shopQuery, [sellerId]);

      if (shopRows.length === 0 || !shopRows[0].ID_CuaHang) {
        throw new Error("Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng trước.");
      }

      const {
        tenSanPham,
        moTa,
        gia,
        tonKho,
        danhMuc,
        trangThai = "active",
      } = productData;

      const query = `
        INSERT INTO SanPham (TenSanPham, MoTa, Gia, TonKho, ID_DanhMuc, ID_NguoiBan, TrangThai, CapNhat)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const [result] = await db.execute(query, [
        tenSanPham,
        moTa,
        gia,
        tonKho,
        danhMuc,
        sellerId, // Use sellerId directly for ID_NguoiBan
        trangThai,
      ]);
      return result.insertId;
    } catch (error) {
      console.error("[SELLER] Error in addProduct:", error);
      throw error;
    }
  }

  // Update product (without stock - stock managed separately)
  static async updateProduct(sellerId, productId, productData) {
    try {
      const { tenSanPham, moTa, gia, danhMuc, trangThai } = productData;

      // Verify product belongs to seller
      const verifyQuery = `
        SELECT p.ID_SanPham 
        FROM SanPham p 
        WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?
      `;

      const [verifyRows] = await db.execute(verifyQuery, [productId, sellerId]);

      if (verifyRows.length === 0) {
        throw new Error(
          "Sản phẩm không tồn tại hoặc bạn không có quyền chỉnh sửa."
        );
      }

      const query = `
        UPDATE SanPham 
        SET TenSanPham = ?, MoTa = ?, Gia = ?, ID_DanhMuc = ?, TrangThai = ?, CapNhat = CURRENT_TIMESTAMP
        WHERE ID_SanPham = ?
      `;

      const [result] = await db.execute(query, [
        tenSanPham,
        moTa,
        gia,
        danhMuc,
        trangThai,
        productId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("[SELLER] Error in updateProduct:", error);
      throw error;
    }
  }

  // Add stock to product (import goods)
  static async addStock(sellerId, productId, stockData) {
    let connection;
    try {
      console.log(
        `[SELLER] Starting addStock for seller: ${sellerId}, product: ${productId}`
      );

      const { soLuongThayDoi, hanhDong = "import" } = stockData;

      // Get connection from pool
      connection = await db.getConnection();

      // Set timeout for this connection to prevent hanging
      await connection.query("SET SESSION innodb_lock_wait_timeout = 10");

      // Start transaction
      await connection.query("START TRANSACTION");

      // Verify product belongs to seller and get current info
      const [verifyRows] = await connection.execute(
        `SELECT p.ID_SanPham, p.TonKho, p.TenSanPham
         FROM SanPham p 
         WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?`,
        [productId, sellerId]
      );

      if (verifyRows.length === 0) {
        throw new Error(
          "Sản phẩm không tồn tại hoặc bạn không có quyền chỉnh sửa."
        );
      }

      const currentProduct = verifyRows[0];
      const oldStock = currentProduct.TonKho;
      const newStock = oldStock + parseInt(soLuongThayDoi);

      if (newStock < 0) {
        throw new Error("Số lượng tồn kho không thể âm.");
      }

      // Update product stock
      const [updateResult] = await connection.execute(
        `UPDATE SanPham 
         SET TonKho = ?, CapNhat = CURRENT_TIMESTAMP
         WHERE ID_SanPham = ?`,
        [newStock, productId]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error("Không thể cập nhật tồn kho sản phẩm.");
      }

      // Insert stock change log
      await connection.execute(
        `INSERT INTO nhatkythaydoitonkho (ID_SanPham, SoLuongThayDoi, HanhDong, ThoiGian)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [productId, soLuongThayDoi, hanhDong]
      );

      // Commit transaction
      await connection.query("COMMIT");

      console.log(
        `[SELLER] Stock updated successfully: ${oldStock} -> ${newStock}`
      );

      return {
        success: true,
        oldStock,
        newStock,
        change: soLuongThayDoi,
        productName: currentProduct.TenSanPham,
      };
    } catch (error) {
      console.error("[SELLER] Error in addStock:", error);

      // Rollback transaction if connection exists
      if (connection) {
        try {
          await connection.query("ROLLBACK");
          console.log("[SELLER] Transaction rolled back");
        } catch (rollbackError) {
          console.error("[SELLER] Rollback error:", rollbackError);
        }
      }

      throw error;
    } finally {
      // Always release connection
      if (connection) {
        connection.release();
        console.log("[SELLER] Database connection released");
      }
    }
  }

  // Get stock change history for a product
  static async getStockHistory(sellerId, productId, page = 1, limit = 10) {
    try {
      // Verify product belongs to seller
      const verifyQuery = `
        SELECT p.ID_SanPham, p.TenSanPham
        FROM SanPham p 
        WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?
      `;

      const [verifyRows] = await db.execute(verifyQuery, [productId, sellerId]);

      if (verifyRows.length === 0) {
        throw new Error("Sản phẩm không tồn tại hoặc bạn không có quyền xem.");
      }

      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          n.ID_NhatKy,
          n.SoLuongThayDoi,
          n.HanhDong,
          n.ThoiGian,
          p.TenSanPham
        FROM nhatkythaydoitonkho n
        JOIN SanPham p ON n.ID_SanPham = p.ID_SanPham
        WHERE n.ID_SanPham = ?
        ORDER BY n.ThoiGian DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.execute(query, [productId, limit, offset]);

      // Count total
      const countQuery = `
        SELECT COUNT(*) as total
        FROM nhatkythaydoitonkho
        WHERE ID_SanPham = ?
      `;

      const [countResult] = await db.execute(countQuery, [productId]);
      const total = countResult[0].total;

      return {
        history: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages: Math.ceil(total / limit),
        },
        productName: verifyRows[0].TenSanPham,
      };
    } catch (error) {
      console.error("[SELLER] Error in getStockHistory:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(sellerId, productId) {
    try {
      // Verify product belongs to seller
      const verifyQuery = `
        SELECT p.ID_SanPham 
        FROM SanPham p 
        WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?
      `;

      const [verifyRows] = await db.execute(verifyQuery, [productId, sellerId]);

      if (verifyRows.length === 0) {
        throw new Error("Sản phẩm không tồn tại hoặc bạn không có quyền xóa.");
      }

      // Soft delete by setting status to inactive
      const query =
        "UPDATE SanPham SET TrangThai = 'inactive' WHERE ID_SanPham = ?";
      const [result] = await db.execute(query, [productId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("[SELLER] Error in deleteProduct:", error);
      throw error;
    }
  }

  // Get product by ID (seller-specific)
  static async getProductById(sellerId, productId) {
    try {
      const query = `
        SELECT 
          p.ID_SanPham,
          p.TenSanPham,
          p.MoTa,
          p.Gia,
          p.TonKho,
          p.TrangThai,
          GROUP_CONCAT(a.Url) as image_urls,
          p.CapNhat as created_date,
          dm.TenDanhMuc,
          dm.ID_DanhMuc,
          c.TenCuaHang
        FROM SanPham p
        LEFT JOIN nguoidung n ON p.ID_NguoiBan = n.ID_NguoiDung
        LEFT JOIN cuahang c ON n.ID_CuaHang = c.ID_CuaHang
        LEFT JOIN danhmuc dm ON p.ID_DanhMuc = dm.ID_DanhMuc
        LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
        WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?
        GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, dm.TenDanhMuc, dm.ID_DanhMuc, c.TenCuaHang
      `;

      const [rows] = await db.execute(query, [productId, sellerId]);
      return rows[0];
    } catch (error) {
      console.error("[SELLER] Error in getProductById:", error);
      throw error;
    }
  }
}

export default Seller;
