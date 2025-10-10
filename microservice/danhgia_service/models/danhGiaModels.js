import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pycshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const danhGiaModel = {
  // Tạo đánh giá mới
  createReview: async (reviewData) => {
    const connection = await pool.getConnection();
    try {
      // Insert review
      const [result] = await connection.execute(
        `INSERT INTO danhgiasanpham (ID_SanPham, ID_NguoiMua, BinhLuan, TyLe, ThoiGian) 
         VALUES (?, ?, ?, ?, NOW())`,
        [reviewData.productId, reviewData.userId, reviewData.comment, reviewData.rating]
      );

      // Get the created review with user info
      const [review] = await connection.execute(
        `SELECT 
          dg.ID_DanhGia,
          dg.ID_SanPham,
          dg.ID_NguoiMua,
          dg.BinhLuan,
          dg.TyLe,
          dg.ThoiGian,
          nd.HoTen as user_name
         FROM danhgiasanpham dg
         LEFT JOIN nguoidung nd ON dg.ID_NguoiMua = nd.ID_NguoiDung
         WHERE dg.ID_DanhGia = ?`,
        [result.insertId]
      );

      return {
        success: true,
        data: review[0],
        insertId: result.insertId
      };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Lấy danh sách đánh giá của sản phẩm
  getProductReviews: async (productId, page = 1, limit = 10) => {
    const connection = await pool.getConnection();
    try {
      const offset = (page - 1) * limit;

      // Get reviews with user info
      const [reviews] = await connection.execute(
        `SELECT 
          dg.ID_DanhGia,
          dg.ID_SanPham,
          dg.ID_NguoiMua,
          dg.BinhLuan,
          dg.TyLe,
          dg.ThoiGian,
          nd.HoTen as user_name,
          nd.AvatarUrl as user_avatar
         FROM danhgiasanpham dg
         LEFT JOIN nguoidung nd ON dg.ID_NguoiMua = nd.ID_NguoiDung
         WHERE dg.ID_SanPham = ?
         ORDER BY dg.ThoiGian DESC
         LIMIT ? OFFSET ?`,
        [productId, limit, offset]
      );

      // Get total count for pagination
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total FROM danhgiasanpham WHERE ID_SanPham = ?`,
        [productId]
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: reviews,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          total: total,
          limit: limit
        }
      };
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Kiểm tra xem user đã đánh giá sản phẩm này chưa
  checkUserReview: async (productId, userId) => {
    const connection = await pool.getConnection();
    try {
      const [existing] = await connection.execute(
        `SELECT 
          dg.ID_DanhGia,
          dg.BinhLuan,
          dg.TyLe,
          dg.ThoiGian
         FROM danhgiasanpham dg
         WHERE dg.ID_SanPham = ? AND dg.ID_NguoiMua = ?`,
        [productId, userId]
      );

      return {
        success: true,
        hasReviewed: existing.length > 0,
        review: existing.length > 0 ? existing[0] : null
      };
    } catch (error) {
      console.error('Error checking user review:', error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Lấy shop ID từ product ID để gửi message
  getShopIdByProductId: async (productId) => {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `SELECT sp.ID_CuaHang 
         FROM sanpham sp 
         WHERE sp.ID_SanPham = ?`,
        [productId]
      );

      return result.length > 0 ? result[0].ID_CuaHang : null;
    } catch (error) {
      console.error('Error getting shop ID:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
};

export default danhGiaModel;
