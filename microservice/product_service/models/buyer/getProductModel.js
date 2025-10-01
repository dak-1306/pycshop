import db from "../../../db/index.js";

class Product {
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
          c.TenDanhMuc,
          c.ID_DanhMuc
        FROM SanPham p
        LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
        LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
        ${whereClause}
        GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, c.TenDanhMuc, c.ID_DanhMuc
        ORDER BY p.${finalSortBy} ${finalSortOrder}
        LIMIT ? OFFSET ?
      `;

      // Add pagination params
      params.push(limit, offset);

      console.log(`[PRODUCT] Executing query:`, query);
      console.log(`[PRODUCT] With params:`, params);

      const [rows] = await db.execute(query, params);

      // Count total for pagination
      const countQuery = `
        SELECT COUNT(DISTINCT p.ID_SanPham) as total
        FROM SanPham p
        LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
        WHERE p.TrangThai != 'inactive'${
          whereClause.includes("WHERE")
            ? " AND " + whereClause.replace("WHERE ", "")
            : ""
        }
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

  // Get product by ID
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
          GROUP_CONCAT(a.Url) as image_urls,
          p.CapNhat as created_date,
          c.TenDanhMuc,
          c.ID_DanhMuc
        FROM SanPham p
        LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
        LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
        WHERE p.ID_SanPham = ? AND p.TrangThai != 'inactive'
        GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, c.TenDanhMuc, c.ID_DanhMuc
      `;

      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("[PRODUCT] Error in getProductById:", error);
      throw error;
    }
  }

  // Get all categories
  static async getCategories() {
    try {
      const query = `
        SELECT 
          c.ID_DanhMuc,
          c.TenDanhMuc,
          c.MoTa,
          COUNT(p.ID_SanPham) as product_count
        FROM DanhMuc c
        LEFT JOIN SanPham p ON c.ID_DanhMuc = p.ID_DanhMuc
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
}

export default Product;
