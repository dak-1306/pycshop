import db from "../../db/index.js";

class Shop {
  // Get shop information by seller ID
  static async getShopBySellerId(sellerId) {
    try {
      const query = `
        SELECT 
          c.ID_CuaHang as id,
          c.TenCuaHang as name,
          c.ID_DanhMuc as category_id,
          c.DiaChiCH as address,
          c.SoDienThoaiCH as phone,
          c.NgayCapNhat as updated_at,
          d.TenDanhMuc as category_name,
          n.HoTen as owner_name,
          n.Email as owner_email
        FROM CuaHang c
        LEFT JOIN DanhMuc d ON c.ID_DanhMuc = d.ID_DanhMuc
        LEFT JOIN NguoiDung n ON n.ID_CuaHang = c.ID_CuaHang
        WHERE n.ID_NguoiDung = ?
      `;

      const [rows] = await db.execute(query, [sellerId]);
      return rows[0] || null;
    } catch (error) {
      console.error("[SHOP] Error in getShopBySellerId:", error);
      throw error;
    }
  }

  // Get shop information by shop ID
  static async getShopById(shopId) {
    try {
      //Lấy thông tin ảnh và danh mục
      const shopQuery = `
        SELECT 
          c.*, 
          nd.ID_NguoiDung,
          d.TenDanhMuc AS category_name,
        (
          SELECT COUNT(*)
          FROM sanpham sp
          WHERE sp.ID_NguoiBan = nd.ID_NguoiDung
        ) AS product_count
        FROM cuahang c
        LEFT JOIN DanhMuc d ON c.ID_DanhMuc = d.ID_DanhMuc
        LEFT JOIN nguoidung nd ON nd.ID_CuaHang = c.ID_CuaHang
        WHERE c.ID_CuaHang = ?;
      `;

      const [shopRows] = await db.execute(shopQuery, [shopId]);
      return shopRows[0] || null;
    } catch (error) {
      console.error("[SHOP] Error in getShopById:", error);
      throw error;
    }
  }

  // Create new shop with retry mechanism
  static async createShop(sellerId, shopData, retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    let connection;

    try {
      console.log(
        `[SHOP] Creating shop for seller ${sellerId}, attempt ${retryCount + 1}`
      );

      // Get connection with timeout settings
      connection = await db.getConnection();

      // Set session variables for this connection
      await connection.query("SET SESSION innodb_lock_wait_timeout = 10");
      await connection.query("SET SESSION autocommit = 0");

      await connection.beginTransaction();

      const { name, description, category_id, address, phone } = shopData;

      // Check if user already has a shop
      const checkUserQuery = `
        SELECT ID_CuaHang, HoTen 
        FROM NguoiDung 
        WHERE ID_NguoiDung = ? 
        FOR UPDATE
      `;

      const [userRows] = await connection.execute(checkUserQuery, [sellerId]);

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      if (userRows[0].ID_CuaHang) {
        throw new Error("User already has a shop");
      }

      console.log(
        `[SHOP] User ${userRows[0].HoTen} is eligible to create shop`
      );

      // Insert new shop
      const insertShopQuery = `
        INSERT INTO CuaHang (TenCuaHang, ID_DanhMuc, DiaChiCH, SoDienThoaiCH, NgayCapNhat)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      const [shopResult] = await connection.execute(insertShopQuery, [
        name,
        category_id,
        address,
        phone,
      ]);

      const shopId = shopResult.insertId;
      console.log(`[SHOP] Shop created with ID: ${shopId}`);

      // Update user to link with shop
      const updateUserQuery = `
        UPDATE NguoiDung 
        SET ID_CuaHang = ? 
        WHERE ID_NguoiDung = ? AND ID_CuaHang IS NULL
      `;

      const [updateResult] = await connection.execute(updateUserQuery, [
        shopId,
        sellerId,
      ]);

      if (updateResult.affectedRows === 0) {
        throw new Error(
          "Failed to link shop to user - user may already have a shop"
        );
      }

      console.log(`[SHOP] User ${sellerId} linked to shop ${shopId}`);

      await connection.commit();
      console.log(`[SHOP] Transaction committed successfully`);

      return shopId;
    } catch (error) {
      console.error(
        `[SHOP] Error in createShop (attempt ${retryCount + 1}):`,
        error
      );

      if (connection) {
        try {
          await connection.rollback();
          console.log(`[SHOP] Transaction rolled back`);
        } catch (rollbackError) {
          console.error(`[SHOP] Rollback error:`, rollbackError);
        }
      }

      // Retry for lock timeout errors
      if (error.code === "ER_LOCK_WAIT_TIMEOUT" && retryCount < maxRetries) {
        console.log(
          `[SHOP] Retrying in ${retryDelay}ms... (${
            retryCount + 1
          }/${maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return this.createShop(sellerId, shopData, retryCount + 1);
      }

      throw error;
    } finally {
      if (connection) {
        connection.release();
        console.log(`[SHOP] Connection released`);
      }
    }
  }

  // Update shop information
  static async updateShop(sellerId, shopData) {
    try {
      const { name, description, category_id, address, phone } = shopData;

      const query = `
        UPDATE CuaHang c
        JOIN NguoiDung n ON c.ID_CuaHang = n.ID_CuaHang
        SET c.TenCuaHang = ?,
            c.ID_DanhMuc = ?,
            c.DiaChiCH = ?,
            c.SoDienThoaiCH = ?,
            c.NgayCapNhat = CURRENT_TIMESTAMP
        WHERE n.ID_NguoiDung = ?
      `;

      const [result] = await db.execute(query, [
        name,
        category_id,
        address,
        phone,
        sellerId,
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error("[SHOP] Error in updateShop:", error);
      throw error;
    }
  }

  // Delete shop
  static async deleteShop(sellerId) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Get shop ID first
      const shop = await this.getShopBySellerId(sellerId);
      if (!shop) {
        throw new Error("Shop not found");
      }

      // Update user to remove shop link
      const updateUserQuery = `
        UPDATE NguoiDung 
        SET ID_CuaHang = NULL 
        WHERE ID_NguoiDung = ?
      `;

      await connection.execute(updateUserQuery, [sellerId]);

      // Delete shop
      const deleteShopQuery = `
        DELETE FROM CuaHang 
        WHERE ID_CuaHang = ?
      `;

      await connection.execute(deleteShopQuery, [shop.id]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("[SHOP] Error in deleteShop:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const query = `
        SELECT 
          ID_DanhMuc as id,
          TenDanhMuc as name
        FROM DanhMuc
        ORDER BY TenDanhMuc
      `;

      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error("[SHOP] Error in getCategories:", error);
      throw error;
    }
  }

  // Get shops by category
  static async getShopsByCategory(categoryId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          c.ID_CuaHang as id,
          c.TenCuaHang as name,
          c.DiaChiCH as address,
          c.SoDienThoaiCH as phone,
          c.NgayCapNhat as updated_at,
          d.TenDanhMuc as category_name,
          COUNT(p.ID_SanPham) as product_count
        FROM CuaHang c
        LEFT JOIN DanhMuc d ON c.ID_DanhMuc = d.ID_DanhMuc
        LEFT JOIN NguoiDung n ON n.ID_CuaHang = c.ID_CuaHang
        LEFT JOIN SanPham p ON p.ID_NguoiBan = n.ID_NguoiDung
        WHERE c.ID_DanhMuc = ?
        GROUP BY c.ID_CuaHang, c.TenCuaHang, c.DiaChiCH, c.SoDienThoaiCH, c.NgayCapNhat, d.TenDanhMuc
        ORDER BY c.NgayCapNhat DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.execute(query, [categoryId, limit, offset]);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM CuaHang c
        WHERE c.ID_DanhMuc = ?
      `;

      const [countResult] = await db.execute(countQuery, [categoryId]);
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        shops: rows,
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
      console.error("[SHOP] Error in getShopsByCategory:", error);
      throw error;
    }
  }

  // Search shops
  static async searchShops(searchTerm, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          c.ID_CuaHang as id,
          c.TenCuaHang as name,
          c.DiaChiCH as address,
          c.SoDienThoaiCH as phone,
          c.NgayCapNhat as updated_at,
          d.TenDanhMuc as category_name,
          COUNT(p.ID_SanPham) as product_count
        FROM CuaHang c
        LEFT JOIN DanhMuc d ON c.ID_DanhMuc = d.ID_DanhMuc
        LEFT JOIN NguoiDung n ON n.ID_CuaHang = c.ID_CuaHang
        LEFT JOIN SanPham p ON p.ID_NguoiBan = n.ID_NguoiDung
        WHERE c.TenCuaHang LIKE ? OR c.DiaChiCH LIKE ?
        GROUP BY c.ID_CuaHang, c.TenCuaHang, c.DiaChiCH, c.SoDienThoaiCH, c.NgayCapNhat, d.TenDanhMuc
        ORDER BY c.NgayCapNhat DESC
        LIMIT ? OFFSET ?
      `;

      const searchPattern = `%${searchTerm}%`;
      const [rows] = await db.execute(query, [
        searchPattern,
        searchPattern,
        limit,
        offset,
      ]);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM CuaHang c
        WHERE c.TenCuaHang LIKE ? OR c.DiaChiCH LIKE ?
      `;

      const [countResult] = await db.execute(countQuery, [
        searchPattern,
        searchPattern,
      ]);
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        shops: rows,
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
      console.error("[SHOP] Error in searchShops:", error);
      throw error;
    }
  }
}

export default Shop;
