import db from "../../../db/index.js";

class InventoryModel {
  // Cập nhật tồn kho sau khi đặt hàng
  static async updateInventoryAfterOrder(orderItems) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[INVENTORY_MODEL] Starting inventory update transaction for ${orderItems.length} items`
      );

      const inventoryUpdates = [];
      const inventoryLogs = [];

      for (const item of orderItems) {
        const { productId, quantity } = item;

        console.log(
          `[INVENTORY_MODEL] Processing product ${productId}, quantity: ${quantity}`
        );

        // 1. Kiểm tra tồn kho hiện tại
        const [currentStock] = await connection.execute(
          'SELECT TonKho, TenSanPham FROM sanpham WHERE ID_SanPham = ? AND TrangThai != "inactive"',
          [productId]
        );

        if (currentStock.length === 0) {
          throw new Error(`Product ${productId} not found or inactive`);
        }

        const currentQuantity = currentStock[0].TonKho;
        const productName = currentStock[0].TenSanPham;

        if (currentQuantity < quantity) {
          throw new Error(
            `Insufficient stock for product ${productId} (${productName}). Available: ${currentQuantity}, Required: ${quantity}`
          );
        }

        const newQuantity = currentQuantity - quantity;

        // 2. Cập nhật tồn kho trong bảng sanpham
        const [updateResult] = await connection.execute(
          "UPDATE sanpham SET TonKho = ?, CapNhat = CURRENT_TIMESTAMP WHERE ID_SanPham = ?",
          [newQuantity, productId]
        );

        if (updateResult.affectedRows === 0) {
          throw new Error(
            `Failed to update inventory for product ${productId}`
          );
        }

        console.log(
          `[INVENTORY_MODEL] Updated stock for ${productName}: ${currentQuantity} -> ${newQuantity}`
        );

        // 3. Ghi log vào bảng nhatkythaydoitonkho
        await connection.execute(
          `INSERT INTO nhatkythaydoitonkho (ID_NhatKy, ID_SanPham, SoLuongThayDoi, HanhDong, ThoiGian) 
           VALUES (NULL, ?, ?, 'export', CURRENT_TIMESTAMP)`,
          [productId, quantity]
        );

        inventoryUpdates.push({
          productId,
          productName,
          previousStock: currentQuantity,
          newStock: newQuantity,
          quantityReduced: quantity,
        });

        inventoryLogs.push({
          productId,
          quantityChanged: quantity,
          action: "export",
        });
      }

      await connection.commit();
      console.log(
        `[INVENTORY_MODEL] Successfully updated inventory for ${orderItems.length} products`
      );

      return {
        success: true,
        message: "Inventory updated successfully",
        updates: inventoryUpdates,
        logs: inventoryLogs,
      };
    } catch (error) {
      await connection.rollback();
      console.error("[INVENTORY_MODEL] Error updating inventory:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Kiểm tra tồn kho trước khi đặt hàng
  static async checkInventoryAvailability(orderItems) {
    try {
      console.log(
        `[INVENTORY_MODEL] Checking availability for ${orderItems.length} items`
      );

      const availabilityResults = [];
      let allAvailable = true;

      for (const item of orderItems) {
        const { productId, quantity } = item;

        const [rows] = await db.execute(
          "SELECT TonKho, TenSanPham, TrangThai FROM sanpham WHERE ID_SanPham = ?",
          [productId]
        );

        if (rows.length === 0) {
          availabilityResults.push({
            productId,
            available: false,
            reason: "Product not found",
            currentStock: 0,
            requestedQuantity: quantity,
          });
          allAvailable = false;
          continue;
        }

        const product = rows[0];

        if (product.TrangThai === "inactive") {
          availabilityResults.push({
            productId,
            productName: product.TenSanPham,
            available: false,
            reason: "Product is inactive",
            currentStock: product.TonKho,
            requestedQuantity: quantity,
          });
          allAvailable = false;
          continue;
        }

        const isAvailable = product.TonKho >= quantity;

        availabilityResults.push({
          productId,
          productName: product.TenSanPham,
          available: isAvailable,
          reason: isAvailable ? "Available" : "Insufficient stock",
          currentStock: product.TonKho,
          requestedQuantity: quantity,
        });

        if (!isAvailable) {
          allAvailable = false;
        }
      }

      console.log(
        `[INVENTORY_MODEL] Availability check completed. All available: ${allAvailable}`
      );

      return {
        success: true,
        allAvailable,
        results: availabilityResults,
      };
    } catch (error) {
      console.error(
        "[INVENTORY_MODEL] Error checking inventory availability:",
        error
      );
      throw error;
    }
  }

  // Lấy lịch sử thay đổi tồn kho của sản phẩm
  static async getInventoryHistory(productId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await db.execute(
        `SELECT 
          nk.ID_NhatKy,
          nk.ID_SanPham,
          nk.SoLuongThayDoi,
          nk.HanhDong,
          nk.ThoiGian,
          sp.TenSanPham
         FROM nhatkythaydoitonkho nk
         LEFT JOIN sanpham sp ON nk.ID_SanPham = sp.ID_SanPham
         WHERE nk.ID_SanPham = ?
         ORDER BY nk.ThoiGian DESC
         LIMIT ? OFFSET ?`,
        [productId, limit, offset]
      );

      // Đếm tổng số records
      const [countResult] = await db.execute(
        "SELECT COUNT(*) as total FROM nhatkythaydoitonkho WHERE ID_SanPham = ?",
        [productId]
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: rows,
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
        "[INVENTORY_MODEL] Error getting inventory history:",
        error
      );
      throw error;
    }
  }

  // Rollback tồn kho (trong trường hợp hủy đơn hàng - có thể dùng sau)
  static async rollbackInventory(orderItems) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      console.log(
        `[INVENTORY_MODEL] Rolling back inventory for ${orderItems.length} items`
      );

      for (const item of orderItems) {
        const { productId, quantity } = item;

        // Cộng lại số lượng vào tồn kho
        await connection.execute(
          "UPDATE sanpham SET TonKho = TonKho + ?, CapNhat = CURRENT_TIMESTAMP WHERE ID_SanPham = ?",
          [quantity, productId]
        );

        // Ghi log import
        await connection.execute(
          `INSERT INTO nhatkythaydoitonkho (ID_NhatKy, ID_SanPham, SoLuongThayDoi, HanhDong, ThoiGian) 
           VALUES (NULL, ?, ?, 'import', CURRENT_TIMESTAMP)`,
          [productId, quantity]
        );

        console.log(
          `[INVENTORY_MODEL] Rolled back ${quantity} units for product ${productId}`
        );
      }

      await connection.commit();
      console.log(`[INVENTORY_MODEL] Successfully rolled back inventory`);

      return {
        success: true,
        message: "Inventory rollback completed",
      };
    } catch (error) {
      await connection.rollback();
      console.error("[INVENTORY_MODEL] Error rolling back inventory:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default InventoryModel;
