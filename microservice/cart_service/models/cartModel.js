import { pool } from "../db/mysql.js";

export class CartModel {
  // Load cart from MySQL database
  static async loadFromDatabase(userId) {
    const connection = await pool.getConnection();
    try {
      // Get cart ID for user
      const [cartRows] = await connection.query(
        "SELECT ID_GioHang FROM giohang WHERE ID_NguoiMua = ?",
        [userId]
      );

      if (cartRows.length === 0) {
        console.log(`[CART_MODEL] No cart found in MySQL for user ${userId}`);
        return {};
      }

      const cartId = cartRows[0].ID_GioHang;

      // Get cart items with product details
      const [itemRows] = await connection.query(
        `
            WITH latest_images AS (
            SELECT 
                ID_SanPham,
                Url,
                ROW_NUMBER() OVER (PARTITION BY ID_SanPham ORDER BY Upload_at DESC) AS rn
            FROM AnhSanPham
        )
            SELECT 
                sptg.ID_SanPham AS productId,
                sptg.SoLuong AS quantity,
                sp.TenSanPham AS name,
                sp.Gia AS price,
                li.Url AS image,
                sp.MoTa AS description
            FROM sanphamtronggio sptg
            LEFT JOIN sanpham sp ON sptg.ID_SanPham = sp.ID_SanPham
            LEFT JOIN latest_images li ON li.ID_SanPham = sp.ID_SanPham AND li.rn = 1
            WHERE sptg.ID_GioHang = ?;

      `,
        [cartId]
      );

      const cart = {};
      for (const item of itemRows) {
        cart[item.productId] = {
          quantity: item.quantity,
          product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
          },
        };
      }

      console.log(
        `[CART_MODEL] Loaded ${
          Object.keys(cart).length
        } items from MySQL for user ${userId}`
      );
      return cart;
    } catch (error) {
      console.error("[CART_MODEL] Error loading cart from MySQL:", error);
      return {};
    } finally {
      connection.release();
    }
  }

  // Sync cart from Redis to MySQL
  static async syncToDatabase(userId, cart) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check if cart exists in MySQL
      const [cartRows] = await connection.query(
        "SELECT ID_GioHang FROM giohang WHERE ID_NguoiMua = ?",
        [userId]
      );

      let cartId = cartRows.length ? cartRows[0].ID_GioHang : null;

      // Create cart if doesn't exist
      if (!cartId) {
        const [result] = await connection.query(
          "INSERT INTO giohang (ID_NguoiMua) VALUES (?)",
          [userId]
        );
        cartId = result.insertId;
        console.log(
          `[CART_MODEL] Created new cart ${cartId} for user ${userId}`
        );
      }

      // Clear existing cart items
      await connection.query(
        "DELETE FROM sanphamtronggio WHERE ID_GioHang = ?",
        [cartId]
      );

      // Insert current cart items
      let totalQuantity = 0;
      for (const [productId, itemData] of Object.entries(cart)) {
        const quantity = itemData.quantity || 0;
        if (quantity > 0) {
          await connection.query(
            "INSERT INTO sanphamtronggio (ID_GioHang, ID_SanPham, SoLuong) VALUES (?, ?, ?)",
            [cartId, productId, quantity]
          );
          totalQuantity += quantity;
        }
      }

      // Update cart timestamp to indicate last sync
      await connection.query(
        "UPDATE giohang SET ThoiGianTao = CURRENT_TIMESTAMP WHERE ID_GioHang = ?",
        [cartId]
      );

      await connection.commit();
      console.log(
        `[CART_MODEL] Synced ${
          Object.keys(cart).length
        } items to MySQL for user ${userId}`
      );
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("[CART_MODEL] Error syncing cart to MySQL:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get cart ID for user, create if doesn't exist
  static async getOrCreateCartId(userId) {
    const connection = await pool.getConnection();
    try {
      // Check if cart exists
      const [cartRows] = await connection.query(
        "SELECT ID_GioHang FROM giohang WHERE ID_NguoiMua = ?",
        [userId]
      );

      if (cartRows.length > 0) {
        return cartRows[0].ID_GioHang;
      }

      // Create new cart
      const [result] = await connection.query(
        "INSERT INTO giohang (ID_NguoiMua) VALUES (?)",
        [userId]
      );

      console.log(
        `[CART_MODEL] Created new cart ${result.insertId} for user ${userId}`
      );
      return result.insertId;
    } catch (error) {
      console.error("[CART_MODEL] Error getting/creating cart ID:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Clear cart in database
  static async clearCart(userId) {
    const connection = await pool.getConnection();
    try {
      // Get cart ID
      const [cartRows] = await connection.query(
        "SELECT ID_GioHang FROM giohang WHERE ID_NguoiMua = ?",
        [userId]
      );

      if (cartRows.length === 0) {
        console.log(`[CART_MODEL] No cart found to clear for user ${userId}`);
        return true;
      }

      const cartId = cartRows[0].ID_GioHang;

      // Clear cart items
      await connection.query(
        "DELETE FROM sanphamtronggio WHERE ID_GioHang = ?",
        [cartId]
      );

      // Update cart timestamp
      await connection.query(
        "UPDATE giohang SET ThoiGianTao = CURRENT_TIMESTAMP WHERE ID_GioHang = ?",
        [cartId]
      );

      console.log(`[CART_MODEL] Cleared cart in database for user ${userId}`);
      return true;
    } catch (error) {
      console.error("[CART_MODEL] Error clearing cart in database:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all active cart user IDs (for auto-sync)
  static async getActiveCartUserIds() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(`
        SELECT DISTINCT g.ID_NguoiMua as userId
        FROM giohang g
        INNER JOIN sanphamtronggio sptg ON g.ID_GioHang = sptg.ID_GioHang
        WHERE sptg.SoLuong > 0
      `);

      return rows.map((row) => row.userId);
    } catch (error) {
      console.error("[CART_MODEL] Error getting active cart user IDs:", error);
      return [];
    } finally {
      connection.release();
    }
  }
}

export default CartModel;
