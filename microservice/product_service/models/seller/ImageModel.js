import db from "../../../db/index.js";

class ImageModel {
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
      throw error;
    }
  }

  // Lấy tất cả ảnh của sản phẩm
  static async getImagesByProductId(productId) {
    try {
      const query = `
                SELECT ID_Anh, Url, Upload_at 
                FROM anhsanpham 
                WHERE ID_SanPham = ? 
                ORDER BY Upload_at ASC
            `;
      const [rows] = await db.execute(query, [productId]);
      return rows;
    } catch (error) {
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
      throw error;
    }
  } // Kiểm tra sản phẩm có thuộc về seller không
  static async checkProductOwnership(productId, sellerId) {
    try {
      console.log(
        `[IMAGE_MODEL] checkProductOwnership - ProductID: ${productId}, SellerID: ${sellerId}`
      );

      if (!productId || !sellerId) {
        console.log("[IMAGE_MODEL] Missing productId or sellerId");
        return false;
      }

      const query = `
                SELECT ID_SanPham 
                FROM sanpham 
                WHERE ID_SanPham = ? AND ID_NguoiBan = ?
            `;
      const [rows] = await db.execute(query, [productId, sellerId]);
      console.log(`[IMAGE_MODEL] Query result: ${rows.length} rows found`);
      return rows.length > 0;
    } catch (error) {
      console.error("[IMAGE_MODEL] Error in checkProductOwnership:", error);
      throw error;
    }
  }

  // Lấy thông tin ảnh theo ID
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
      throw error;
    }
  }
}

export default ImageModel;
