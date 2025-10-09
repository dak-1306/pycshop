import db from "../../../db/index.js";

class Seller {
  // Initialize connection settings for GROUP_CONCAT
  static async initializeConnection() {
    try {
      await db.execute("SET SESSION group_concat_max_len = 10000");
    } catch (error) {
      console.warn(
        "[SELLER] Warning: Could not set group_concat_max_len:",
        error.message
      );
    }
  }
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
      // Initialize connection settings
      await this.initializeConnection();
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

      // Main query - Fix GROUP_CONCAT with pagination
      const query = `
        SELECT 
          p.ID_SanPham,
          p.TenSanPham,
          p.MoTa,
          p.Gia,
          p.TonKho,
          p.TrangThai,
          COALESCE(GROUP_CONCAT(DISTINCT a.Url ORDER BY a.Upload_at ASC SEPARATOR ','), '') as image_urls,
          p.CapNhat as created_date,
          dm.TenDanhMuc,
          dm.ID_DanhMuc,
          c.TenCuaHang
        FROM SanPham p
        LEFT JOIN nguoidung n ON p.ID_NguoiBan = n.ID_NguoiDung
        LEFT JOIN cuahang c ON n.ID_CuaHang = c.ID_CuaHang
        LEFT JOIN danhmuc dm ON p.ID_DanhMuc = dm.ID_DanhMuc
        LEFT JOIN anhsanpham a ON p.ID_SanPham = a.ID_SanPham
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

  // Add new product with images
  static async addProduct(sellerId, productData) {
    let connection;
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

      // Get connection for transaction
      connection = await db.getConnection();
      await connection.query("START TRANSACTION");

      // Insert product
      const productQuery = `
        INSERT INTO SanPham (TenSanPham, MoTa, Gia, TonKho, ID_DanhMuc, ID_NguoiBan, TrangThai, CapNhat)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const [productResult] = await connection.execute(productQuery, [
        tenSanPham,
        moTa,
        gia,
        tonKho,
        danhMuc,
        sellerId,
        trangThai,
      ]);

      const productId = productResult.insertId;

      await connection.query("COMMIT");
      return productId;
    } catch (error) {
      if (connection) {
        await connection.query("ROLLBACK");
      }
      console.error("[SELLER] Error in addProduct:", error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Update product (without images - images managed separately)
  static async updateProduct(sellerId, productId, productData) {
    let connection;
    try {
      const { tenSanPham, moTa, gia, danhMuc } = productData;

      // Get connection for transaction
      connection = await db.getConnection();
      await connection.query("START TRANSACTION");

      // Verify product belongs to seller
      const verifyQuery = `
        SELECT p.ID_SanPham 
        FROM SanPham p 
        WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?
      `;

      const [verifyRows] = await connection.execute(verifyQuery, [
        productId,
        sellerId,
      ]);

      if (verifyRows.length === 0) {
        throw new Error(
          "Sản phẩm không tồn tại hoặc bạn không có quyền chỉnh sửa."
        );
      }

      // Update product info
      const updateProductQuery = `
        UPDATE SanPham 
        SET TenSanPham = ?, MoTa = ?, Gia = ?, ID_DanhMuc = ?, TrangThai = 'active', CapNhat = CURRENT_TIMESTAMP
        WHERE ID_SanPham = ?
      `;

      const [result] = await connection.execute(updateProductQuery, [
        tenSanPham,
        moTa,
        gia,
        danhMuc,
        productId,
      ]);

      await connection.query("COMMIT");
      return result.affectedRows > 0;
    } catch (error) {
      if (connection) {
        await connection.query("ROLLBACK");
      }
      console.error("[SELLER] Error in updateProduct:", error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
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

  // Delete product (hard delete from database)
  static async deleteProduct(sellerId, productId) {
    let connection;
    try {
      // Get connection for transaction
      connection = await db.getConnection();
      await connection.query("START TRANSACTION");

      // Verify product belongs to seller
      const verifyQuery = `
        SELECT p.ID_SanPham 
        FROM SanPham p 
        WHERE p.ID_SanPham = ? AND p.ID_NguoiBan = ?
      `;

      const [verifyRows] = await connection.execute(verifyQuery, [
        productId,
        sellerId,
      ]);

      if (verifyRows.length === 0) {
        throw new Error("Sản phẩm không tồn tại hoặc bạn không có quyền xóa.");
      }

      // Delete product images first (foreign key constraint)
      await connection.execute("DELETE FROM anhsanpham WHERE ID_SanPham = ?", [
        productId,
      ]);

      // Delete stock history
      await connection.execute(
        "DELETE FROM nhatkythaydoitonkho WHERE ID_SanPham = ?",
        [productId]
      );

      // Delete the product
      const [result] = await connection.execute(
        "DELETE FROM SanPham WHERE ID_SanPham = ?",
        [productId]
      );

      await connection.query("COMMIT");
      return result.affectedRows > 0;
    } catch (error) {
      if (connection) {
        await connection.query("ROLLBACK");
      }
      console.error("[SELLER] Error in deleteProduct:", error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
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
          COALESCE(GROUP_CONCAT(DISTINCT a.Url ORDER BY a.Upload_at ASC SEPARATOR ','), '') as image_urls,
          p.CapNhat as created_date,
          dm.TenDanhMuc,
          dm.ID_DanhMuc,
          c.TenCuaHang
        FROM SanPham p
        LEFT JOIN nguoidung n ON p.ID_NguoiBan = n.ID_NguoiDung
        LEFT JOIN cuahang c ON n.ID_CuaHang = c.ID_CuaHang
        LEFT JOIN danhmuc dm ON p.ID_DanhMuc = dm.ID_DanhMuc
        LEFT JOIN anhsanpham a ON p.ID_SanPham = a.ID_SanPham
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

  // ================== IMAGE MANAGEMENT METHODS ==================

  // Thêm ảnh sản phẩm mới
  static async addProductImage(productId, imageUrl) {
    try {
      const query = `
        INSERT INTO anhsanpham (ID_SanPham, Url) 
        VALUES (?, ?)
      `;
      const [result] = await db.execute(query, [productId, imageUrl]);
      return result;
    } catch (error) {
      console.error("[SELLER] Error in addProductImage:", error);
      throw error;
    }
  }

  // Lấy số lượng ảnh hiện tại của sản phẩm
  static async getImageCountByProductId(productId) {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM anhsanpham 
        WHERE ID_SanPham = ?
      `;
      const [rows] = await db.execute(query, [productId]);
      return rows[0].count;
    } catch (error) {
      console.error("[SELLER] Error in getImageCountByProductId:", error);
      throw error;
    }
  }

  // Lấy tất cả ảnh của sản phẩm (với kiểm tra quyền seller)
  static async getImagesByProductId(productId, sellerId = null) {
    try {
      let query, params;

      if (sellerId) {
        // Kiểm tra quyền seller
        query = `
          SELECT a.ID_Anh, a.Url, a.Upload_at 
          FROM anhsanpham a
          JOIN sanpham p ON a.ID_SanPham = p.ID_SanPham
          WHERE a.ID_SanPham = ? AND p.ID_NguoiBan = ?
          ORDER BY a.Upload_at ASC
        `;
        params = [productId, sellerId];
      } else {
        // Không kiểm tra quyền (cho public API)
        query = `
          SELECT ID_Anh, Url, Upload_at 
          FROM anhsanpham 
          WHERE ID_SanPham = ? 
          ORDER BY Upload_at ASC
        `;
        params = [productId];
      }

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error("[SELLER] Error in getImagesByProductId:", error);
      throw error;
    }
  }

  // Xóa ảnh sản phẩm
  static async deleteProductImage(imageId, productId) {
    try {
      const query = `
        DELETE FROM anhsanpham 
        WHERE ID_Anh = ? AND ID_SanPham = ?
      `;
      const [result] = await db.execute(query, [imageId, productId]);
      return result;
    } catch (error) {
      console.error("[SELLER] Error in deleteProductImage:", error);
      throw error;
    }
  }

  // Cập nhật thứ tự ảnh sản phẩm
  static async updateImageOrder(productId, imageOrder, sellerId) {
    let connection;
    try {
      console.log(
        `[SELLER] updateImageOrder - ProductID: ${productId}, Order: ${imageOrder}`
      );

      // Verify product ownership
      const isOwner = await this.checkProductOwnership(productId, sellerId);
      if (!isOwner) {
        throw new Error("Không có quyền thay đổi thứ tự ảnh của sản phẩm này");
      }

      // Get connection for transaction
      connection = await db.getConnection();
      await connection.query("START TRANSACTION");

      // Get current images for this product
      const getCurrentImagesQuery = `
        SELECT ID_Anh, Url FROM anhsanpham 
        WHERE ID_SanPham = ? 
        ORDER BY Upload_at ASC
      `;
      const [currentImages] = await connection.execute(getCurrentImagesQuery, [
        productId,
      ]);

      // Create mapping of URL/ID to database ID
      const imageMap = new Map();
      currentImages.forEach((img) => {
        imageMap.set(img.ID_Anh.toString(), img.ID_Anh);
        imageMap.set(img.Url, img.ID_Anh);
      });

      // Update order by modifying Upload_at timestamp with sequence
      const baseTimestamp = new Date();

      for (let i = 0; i < imageOrder.length; i++) {
        const identifier = imageOrder[i];
        const dbImageId =
          imageMap.get(identifier.toString()) || imageMap.get(identifier);

        if (dbImageId) {
          // Set timestamp with sequence to maintain order
          const newTimestamp = new Date(baseTimestamp.getTime() + i * 1000);

          const updateQuery = `
            UPDATE anhsanpham 
            SET Upload_at = ? 
            WHERE ID_Anh = ? AND ID_SanPham = ?
          `;

          await connection.execute(updateQuery, [
            newTimestamp.toISOString().slice(0, 19).replace("T", " "),
            dbImageId,
            productId,
          ]);

          console.log(`[SELLER] Updated image ${dbImageId} to position ${i}`);
        } else {
          console.warn(
            `[SELLER] Could not find image for identifier: ${identifier}`
          );
        }
      }

      await connection.query("COMMIT");
      console.log(
        `[SELLER] Successfully reordered ${imageOrder.length} images`
      );

      return true;
    } catch (error) {
      if (connection) {
        await connection.query("ROLLBACK");
      }
      console.error("[SELLER] Error in updateImageOrder:", error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Kiểm tra sản phẩm có thuộc về seller không
  static async checkProductOwnership(productId, sellerId) {
    try {
      console.log(
        `[SELLER] checkProductOwnership - ProductID: ${productId}, SellerID: ${sellerId}`
      );

      if (!productId || !sellerId) {
        console.log("[SELLER] Missing productId or sellerId");
        return false;
      }

      const query = `
        SELECT ID_SanPham 
        FROM sanpham 
        WHERE ID_SanPham = ? AND ID_NguoiBan = ?
      `;
      const [rows] = await db.execute(query, [productId, sellerId]);
      console.log(`[SELLER] Query result: ${rows.length} rows found`);
      return rows.length > 0;
    } catch (error) {
      console.error("[SELLER] Error in checkProductOwnership:", error);
      throw error;
    }
  }

  // Lấy thông tin ảnh theo ID với thông tin seller
  static async getImageById(imageId) {
    try {
      const query = `
        SELECT asp.*, sp.ID_NguoiBan 
        FROM anhsanpham asp
        JOIN sanpham sp ON asp.ID_SanPham = sp.ID_SanPham
        WHERE asp.ID_Anh = ?
      `;
      const [rows] = await db.execute(query, [imageId]);
      return rows[0];
    } catch (error) {
      console.error("[SELLER] Error in getImageById:", error);
      throw error;
    }
  }

  // Lấy danh mục sản phẩm
  static async getCategories() {
    try {
      const query =
        "SELECT ID_DanhMuc, TenDanhMuc FROM danhmuc ORDER BY TenDanhMuc";
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error("[SELLER] Error in getCategories:", error);
      throw error;
    }
  }

  // ================== ORDER MANAGEMENT METHODS ==================

  // Get seller's orders
  static async getSellerOrders(
    sellerId,
    { page = 1, limit = 10, search = "", status = null }
  ) {
    try {
      const offset = (page - 1) * limit;
      let whereConditions = [
        "o.ID_CuaHang = ch.ID_CuaHang",
        "ch.ID_NguoiBan = ?",
      ];
      let params = [sellerId];

      // Search filter
      if (search) {
        whereConditions.push(
          "(o.TenNguoiNhan LIKE ? OR o.SoDienThoai LIKE ? OR o.DiaChiGiaoHang LIKE ?)"
        );
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Status filter
      if (status) {
        whereConditions.push("o.TrangThai = ?");
        params.push(status);
      }

      const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM donhang o
        JOIN cuahang ch ON o.ID_CuaHang = ch.ID_CuaHang
        ${whereClause}
      `;
      const [countResult] = await db.execute(countQuery, params);
      const total = countResult[0].total;

      // Get orders
      const query = `
        SELECT
          o.ID_DonHang,
          o.TenNguoiNhan,
          o.SoDienThoai,
          o.DiaChiGiaoHang,
          o.TongTien,
          o.TrangThai,
          o.NgayDatHang,
          o.GhiChu,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'ID_ChiTiet', ct.ID_ChiTietDonHang,
              'TenSanPham', sp.TenSanPham,
              'SoLuong', ct.SoLuong,
              'Gia', ct.Gia,
              'HinhAnh', (
                SELECT JSON_ARRAYAGG(hinh.HinhAnh)
                FROM hinhanhsanpham hinh
                WHERE hinh.ID_SanPham = sp.ID_SanPham
                LIMIT 1
              )
            )
          ) as ChiTietDonHang
        FROM donhang o
        JOIN cuahang ch ON o.ID_CuaHang = ch.ID_CuaHang
        LEFT JOIN chitietdonhang ct ON o.ID_DonHang = ct.ID_DonHang
        LEFT JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
        ${whereClause}
        GROUP BY o.ID_DonHang
        ORDER BY o.NgayDatHang DESC
        LIMIT ? OFFSET ?
      `;

      params.push(limit, offset);
      const [rows] = await db.execute(query, params);

      return {
        orders: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("[SELLER] Error in getSellerOrders:", error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId, sellerId) {
    try {
      const query = `
        SELECT
          o.ID_DonHang,
          o.TenNguoiNhan,
          o.SoDienThoai,
          o.DiaChiGiaoHang,
          o.TongTien,
          o.TrangThai,
          o.NgayDatHang,
          o.GhiChu,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'ID_ChiTiet', ct.ID_ChiTietDonHang,
              'TenSanPham', sp.TenSanPham,
              'SoLuong', ct.SoLuong,
              'Gia', ct.Gia,
              'HinhAnh', (
                SELECT JSON_ARRAYAGG(hinh.HinhAnh)
                FROM hinhanhsanpham hinh
                WHERE hinh.ID_SanPham = sp.ID_SanPham
                LIMIT 1
              )
            )
          ) as ChiTietDonHang
        FROM donhang o
        JOIN cuahang ch ON o.ID_CuaHang = ch.ID_CuaHang
        LEFT JOIN chitietdonhang ct ON o.ID_DonHang = ct.ID_DonHang
        LEFT JOIN sanpham sp ON ct.ID_SanPham = sp.ID_SanPham
        WHERE o.ID_DonHang = ? AND ch.ID_NguoiBan = ?
        GROUP BY o.ID_DonHang
      `;

      const [rows] = await db.execute(query, [orderId, sellerId]);
      return rows[0] || null;
    } catch (error) {
      console.error("[SELLER] Error in getOrderById:", error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, sellerId, status) {
    try {
      const query = `
        UPDATE donhang o
        JOIN cuahang ch ON o.ID_CuaHang = ch.ID_CuaHang
        SET o.TrangThai = ?, o.CapNhat = CURRENT_TIMESTAMP
        WHERE o.ID_DonHang = ? AND ch.ID_NguoiBan = ?
      `;

      const [result] = await db.execute(query, [status, orderId, sellerId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("[SELLER] Error in updateOrderStatus:", error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStats(sellerId) {
    try {
      const query = `
        SELECT
          COUNT(*) as totalOrders,
          SUM(CASE WHEN TrangThai = 'pending' THEN 1 ELSE 0 END) as pendingOrders,
          SUM(CASE WHEN TrangThai = 'confirmed' THEN 1 ELSE 0 END) as confirmedOrders,
          SUM(CASE WHEN TrangThai = 'shipping' THEN 1 ELSE 0 END) as shippingOrders,
          SUM(CASE WHEN TrangThai = 'delivered' THEN 1 ELSE 0 END) as deliveredOrders,
          SUM(CASE WHEN TrangThai = 'cancelled' THEN 1 ELSE 0 END) as cancelledOrders,
          SUM(TongTien) as totalRevenue,
          AVG(TongTien) as averageOrderValue
        FROM donhang o
        JOIN cuahang ch ON o.ID_CuaHang = ch.ID_CuaHang
        WHERE ch.ID_NguoiBan = ?
      `;

      const [rows] = await db.execute(query, [sellerId]);
      return (
        rows[0] || {
          totalOrders: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          shippingOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
        }
      );
    } catch (error) {
      console.error("[SELLER] Error in getOrderStats:", error);
      throw error;
    }
  }
}

export default Seller;
