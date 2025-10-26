import db from "../../../db/index.js";

class Product {
  // Initialize connection settings for GROUP_CONCAT
  static async initializeConnection() {
    try {
      await db.execute("SET SESSION group_concat_max_len = 10000");
    } catch (error) {
      console.warn(
        "[PRODUCT] Warning: Could not set group_concat_max_len:",
        error.message
      );
    }
  }
  // Get products with pagination, category filter, and search
  static async getProducts({
    page = 1,
    limit = 20,
    category = null,
    search = null,
    sortBy = "created_date",
    sortOrder = "DESC",
  }) {
    try {
      // Initialize connection settings
      await this.initializeConnection();
      const offset = (page - 1) * limit;
      let whereConditions = [];
      let params = [];

      // Category filter
      if (category) {
        whereConditions.push("p.ID_DanhMuc = ?");
        params.push(category);
      }

      // Search filter
      if (search) {
        whereConditions.push("(p.TenSanPham LIKE ? OR p.MoTa LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
      }

      // Filter out inactive products - only show active and out_of_stock
      whereConditions.push("p.TrangThai != 'inactive'");

      // Build WHERE clause
      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      // Valid sort columns - map frontend names to actual column names
      const sortColumnMap = {
        created_date: "CapNhat",
        TenSanPham: "TenSanPham",
        Gia: "Gia",
        TonKho: "TonKho",
      };
      const validSortOrders = ["ASC", "DESC"];

      const finalSortBy =
        sortColumnMap[sortBy] || sortColumnMap["created_date"];
      const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase())
        ? sortOrder.toUpperCase()
        : "DESC";

      // Try cache first, fallback to real-time calculation
      let useCache = false;
      try {
        const [cacheCheck] = await db.execute(
          "SHOW TABLES LIKE 'product_rating_cache'"
        );
        useCache = cacheCheck.length > 0;
      } catch (error) {
        console.log(
          "[PRODUCT] Cache check failed, using real-time calculation"
        );
      }

      let query;
      if (useCache) {
        // Use cache version for better performance
        query = `
          SELECT 
            p.ID_SanPham,
            p.TenSanPham,
            p.MoTa,
            p.Gia,
            p.TonKho,
            p.TrangThai,
            COALESCE(GROUP_CONCAT(DISTINCT a.Url ORDER BY a.Upload_at ASC SEPARATOR ','), '') as image_urls,
            p.CapNhat as created_date,
            c.TenDanhMuc,
            c.ID_DanhMuc,
            ch.TenCuaHang,
            SUBSTRING_INDEX(ch.DiaChiCH, ',', -1) as shop_location,
            COALESCE(prc.average_rating, 0) as average_rating,
            COALESCE(prc.total_reviews, 0) as review_count
          FROM SanPham p
          LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
          LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
          LEFT JOIN NguoiDung nb ON p.ID_NguoiBan = nb.ID_NguoiDung
          LEFT JOIN CuaHang ch ON nb.ID_CuaHang = ch.ID_CuaHang
          LEFT JOIN product_rating_cache prc ON p.ID_SanPham = prc.ID_SanPham
          ${whereClause}
          GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, c.TenDanhMuc, c.ID_DanhMuc, ch.TenCuaHang, ch.DiaChiCH, prc.average_rating, prc.total_reviews
          ORDER BY p.${finalSortBy} ${finalSortOrder}
          LIMIT ? OFFSET ?
        `;
        console.log("[PRODUCT] Using CACHE mode for better performance");
      } else {
        // Real-time calculation version
        query = `
          SELECT 
            p.ID_SanPham,
            p.TenSanPham,
            p.MoTa,
            p.Gia,
            p.TonKho,
            p.TrangThai,
            COALESCE(GROUP_CONCAT(DISTINCT a.Url ORDER BY a.Upload_at ASC SEPARATOR ','), '') as image_urls,
            p.CapNhat as created_date,
            c.TenDanhMuc,
            c.ID_DanhMuc,
            ch.TenCuaHang,
            SUBSTRING_INDEX(ch.DiaChiCH, ',', -1) as shop_location,
            COALESCE(
              ROUND(
                (SUM(CASE WHEN dg.TyLe = 1 THEN 1 ELSE 0 END) * 1 +
                 SUM(CASE WHEN dg.TyLe = 2 THEN 1 ELSE 0 END) * 2 +
                 SUM(CASE WHEN dg.TyLe = 3 THEN 1 ELSE 0 END) * 3 +
                 SUM(CASE WHEN dg.TyLe = 4 THEN 1 ELSE 0 END) * 4 +
                 SUM(CASE WHEN dg.TyLe = 5 THEN 1 ELSE 0 END) * 5) /
                NULLIF(COUNT(dg.ID_DanhGia), 0)
              , 1)
            , 0) as average_rating,
            COUNT(dg.ID_DanhGia) as review_count
          FROM SanPham p
          LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
          LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
          LEFT JOIN NguoiDung nb ON p.ID_NguoiBan = nb.ID_NguoiDung
          LEFT JOIN CuaHang ch ON nb.ID_CuaHang = ch.ID_CuaHang
          LEFT JOIN DanhGiaSanPham dg ON p.ID_SanPham = dg.ID_SanPham
          ${whereClause}
          GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, c.TenDanhMuc, c.ID_DanhMuc, ch.TenCuaHang, ch.DiaChiCH
          ORDER BY p.${finalSortBy} ${finalSortOrder}
          LIMIT ? OFFSET ?
        `;
        console.log("[PRODUCT] Using REAL-TIME calculation mode");
      }

      // Add pagination params
      params.push(limit, offset);

      console.log(`[PRODUCT] Executing query:`, query);
      console.log(`[PRODUCT] With params:`, params);

      const [rows] = await db.execute(query, params);

      // Count total for pagination (optimized)
      const countQuery = `
        SELECT COUNT(DISTINCT p.ID_SanPham) as total
        FROM SanPham p
        LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
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
      console.error("[PRODUCT] Error in getProducts:", error);
      throw error;
    }
  }

  // Get product by ID with detailed information (without cache)
  static async getProductById(id) {
    try {
      const query = `
        SELECT 
          p.ID_SanPham,
          p.TenSanPham,
          p.MoTa,
          p.Gia,
          p.TonKho,
          p.TrangThai,
          (SELECT GROUP_CONCAT(Url ORDER BY Upload_at ASC SEPARATOR ',')
           FROM AnhSanPham a 
           WHERE a.ID_SanPham = p.ID_SanPham) AS image_urls,
          p.CapNhat as created_date,
          (SELECT COUNT(*) 
           FROM DanhGiaSanPham dg 
           WHERE dg.ID_SanPham = p.ID_SanPham) AS review_count,
          (SELECT COALESCE(ROUND(AVG(dg.TyLe), 1), 0)
           FROM DanhGiaSanPham dg 
           WHERE dg.ID_SanPham = p.ID_SanPham) AS average_rating,
          c.TenDanhMuc,
          c.ID_DanhMuc,
          ch.TenCuaHang,
          ch.ID_CuaHang,
          ch.DiaChiCH,
          SUBSTRING_INDEX(ch.DiaChiCH, ',', -1) as shop_location,
          -- Shop statistics
          (SELECT COUNT(*) 
           FROM SanPham sp 
           WHERE sp.ID_NguoiBan = p.ID_NguoiBan AND sp.TrangThai != 'inactive') AS shop_product_count,
          (SELECT COALESCE(ROUND(AVG(dg2.TyLe), 1), 0)
           FROM SanPham sp2 
           JOIN DanhGiaSanPham dg2 ON sp2.ID_SanPham = dg2.ID_SanPham
           WHERE sp2.ID_NguoiBan = p.ID_NguoiBan) AS shop_average_rating
        FROM SanPham p
        LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
        LEFT JOIN NguoiDung nb ON p.ID_NguoiBan = nb.ID_NguoiDung
        LEFT JOIN CuaHang ch ON nb.ID_CuaHang = ch.ID_CuaHang
        WHERE p.ID_SanPham = ? AND p.TrangThai != 'inactive'
      `;

      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("[PRODUCT] Error in getProductById:", error);
      throw error;
    }
  }

  // Get similar products by category
  static async getSimilarProducts(productId, categoryId, limit = 4) {
    try {
      const query = `
        SELECT 
          p.ID_SanPham,
          p.TenSanPham,
          p.Gia,
          (SELECT a.Url FROM AnhSanPham a 
           WHERE a.ID_SanPham = p.ID_SanPham 
           ORDER BY a.Upload_at ASC LIMIT 1) as first_image,
          COALESCE(ROUND(AVG(dg.TyLe), 1), 0) as average_rating
        FROM SanPham p
        LEFT JOIN DanhGiaSanPham dg ON p.ID_SanPham = dg.ID_SanPham
        WHERE p.ID_DanhMuc = ? 
          AND p.ID_SanPham != ? 
          AND p.TrangThai = 'active'
        GROUP BY p.ID_SanPham, p.TenSanPham, p.Gia
        ORDER BY RAND()
        LIMIT ?
      `;

      const [rows] = await db.execute(query, [categoryId, productId, limit]);
      return rows;
    } catch (error) {
      console.error("[PRODUCT] Error in getSimilarProducts:", error);
      throw error;
    }
  }

  // Get all categories with optimized query (without cache)
  static async getCategories() {
    try {
      // Direct query without cache table for compatibility
      const query = `
        SELECT 
          c.ID_DanhMuc,
          c.TenDanhMuc,
          c.MoTa,
          COUNT(DISTINCT p.ID_SanPham) as product_count
        FROM DanhMuc c
        LEFT JOIN SanPham p ON c.ID_DanhMuc = p.ID_DanhMuc AND p.TrangThai != 'inactive'
        GROUP BY c.ID_DanhMuc, c.TenDanhMuc, c.MoTa
        ORDER BY c.TenDanhMuc ASC
      `;

      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error("[PRODUCT] Error in getCategories:", error);
      throw error;
    }
  }

  // Get product reviews by product ID (optimized for high traffic)
  static async getProductReviews(productId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          dg.ID_DanhGia,
          dg.ID_SanPham,
          dg.ID_NguoiMua,
          dg.BinhLuan,
          dg.TyLe,
          dg.ThoiGian,
          nd.HoTen as reviewer_name
        FROM DanhGiaSanPham dg
        INNER JOIN NguoiDung nd ON dg.ID_NguoiMua = nd.ID_NguoiDung
        WHERE dg.ID_SanPham = ?
        ORDER BY dg.ThoiGian DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.execute(query, [productId, limit, offset]);

      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) as total
        FROM DanhGiaSanPham
        WHERE ID_SanPham = ?
      `;

      const [countResult] = await db.execute(countQuery, [productId]);
      const total = countResult[0].total;

      return {
        reviews: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("[PRODUCT] Error in getProductReviews:", error);
      throw error;
    }
  }

  // Get rating statistics for a product (without cache for compatibility)
  static async getProductRatingStats(productId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_reviews,
          SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) as count_1_star,
          SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) as count_2_star,
          SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) as count_3_star,
          SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) as count_4_star,
          SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) as count_5_star,
          COALESCE(
            ROUND(
              (SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) * 1 +
               SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) * 2 +
               SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) * 3 +
               SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) * 4 +
               SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) * 5) /
              NULLIF(COUNT(*), 0)
            , 1)
          , 0) as average_rating
        FROM DanhGiaSanPham
        WHERE ID_SanPham = ?
      `;

      const [rows] = await db.execute(query, [productId]);
      return (
        rows[0] || {
          total_reviews: 0,
          count_1_star: 0,
          count_2_star: 0,
          count_3_star: 0,
          count_4_star: 0,
          count_5_star: 0,
          average_rating: 0,
        }
      );
    } catch (error) {
      console.error("[PRODUCT] Error in getProductRatingStats:", error);
      throw error;
    }
  }

  // Batch get rating stats for multiple products (without cache)
  static async getBatchProductRatingStats(productIds) {
    try {
      if (!productIds || productIds.length === 0) {
        return {};
      }

      const placeholders = productIds.map(() => "?").join(",");
      const query = `
        SELECT 
          ID_SanPham,
          COUNT(*) as total_reviews,
          COALESCE(
            ROUND(
              (SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) * 1 +
               SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) * 2 +
               SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) * 3 +
               SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) * 4 +
               SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) * 5) /
              NULLIF(COUNT(*), 0)
            , 1)
          , 0) as average_rating
        FROM DanhGiaSanPham
        WHERE ID_SanPham IN (${placeholders})
        GROUP BY ID_SanPham
      `;

      const [rows] = await db.execute(query, productIds);

      // Convert to object for easy lookup
      const stats = {};
      rows.forEach((row) => {
        stats[row.ID_SanPham] = {
          total_reviews: row.total_reviews,
          average_rating: row.average_rating,
        };
      });

      return stats;
    } catch (error) {
      console.error("[PRODUCT] Error in getBatchProductRatingStats:", error);
      throw error;
    }
  }

  //lấy sản phẩm theo cửa hàng
  static async getProductsByShop(shopId, lastId = null, limit = 10) {
    try {
      // Initialize connection settings
      await this.initializeConnection();
      let query = `
        SELECT 
    p.ID_SanPham,
    p.TenSanPham,
    p.MoTa,
    p.Gia,
    p.TonKho,
    p.TrangThai,
    (SELECT GROUP_CONCAT(Url ORDER BY Upload_at ASC SEPARATOR ',')
     FROM AnhSanPham a 
     WHERE a.ID_SanPham = p.ID_SanPham) AS image_urls,
    p.CapNhat AS created_date,

    -- Product review info
    (SELECT COUNT(*) 
     FROM DanhGiaSanPham dg 
     WHERE dg.ID_SanPham = p.ID_SanPham) AS review_count,
    (SELECT COALESCE(ROUND(AVG(dg.TyLe), 1), 0)
     FROM DanhGiaSanPham dg 
     WHERE dg.ID_SanPham = p.ID_SanPham) AS average_rating,

    -- Category info
    c.TenDanhMuc,
    c.ID_DanhMuc,

    -- Shop info
    ch.TenCuaHang,
    ch.ID_CuaHang,
    ch.DiaChiCH,
    SUBSTRING_INDEX(ch.DiaChiCH, ',', -1) AS shop_location,

    -- Shop statistics
    (SELECT COUNT(*) 
     FROM SanPham sp 
     WHERE sp.ID_NguoiBan = p.ID_NguoiBan AND sp.TrangThai != 'inactive') AS shop_product_count,
    (SELECT COALESCE(ROUND(AVG(dg2.TyLe), 1), 0)
     FROM SanPham sp2 
     JOIN DanhGiaSanPham dg2 ON sp2.ID_SanPham = dg2.ID_SanPham
     WHERE sp2.ID_NguoiBan = p.ID_NguoiBan) AS shop_average_rating

FROM SanPham p
LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
LEFT JOIN NguoiDung nb ON p.ID_NguoiBan = nb.ID_NguoiDung
LEFT JOIN CuaHang ch ON nb.ID_CuaHang = ch.ID_CuaHang

WHERE 
    ch.ID_CuaHang = ? 
    AND p.TrangThai = 'active'   


      `;
      const params = [shopId];
      if (lastId) {
        query += ` AND p.ID_SanPham < ?  `;
        params.push(lastId);
      }
      query += `
        GROUP BY 
    p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, 
    p.CapNhat, c.TenDanhMuc, c.ID_DanhMuc, ch.TenCuaHang, ch.ID_CuaHang, ch.DiaChiCH
ORDER BY 
    p.ID_SanPham DESC
LIMIT ?;
      `;
      params.push(limit);

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      console.error("[PRODUCT] Error in getProductsByShop:", error);
      throw error;
    }
  }
}

export default Product;
