import express from "express";
import db from "../db/index.js";
import authMiddleware from "../api_gateway/middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};

// Apply admin middleware to all routes
router.use(authMiddleware);
router.use(requireAdmin);

// Dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    console.log("[ADMIN] Getting dashboard stats");

    // Get user stats
    const [userStats] = await db.execute(`
      SELECT
        COUNT(*) as total_users,
        SUM(CASE WHEN VaiTro = 'seller' THEN 1 ELSE 0 END) as total_sellers,
        SUM(CASE WHEN VaiTro = 'buyer' THEN 1 ELSE 0 END) as total_buyers,
        SUM(CASE WHEN TrangThai = 'active' THEN 1 ELSE 0 END) as active_users
      FROM nguoidung
    `);

    // Get product stats
    const [productStats] = await db.execute(`
      SELECT
        COUNT(*) as total_products,
        SUM(CASE WHEN TrangThai = 'active' THEN 1 ELSE 0 END) as active_products,
        SUM(CASE WHEN TrangThai = 'inactive' THEN 1 ELSE 0 END) as inactive_products,
        SUM(CASE WHEN TrangThai = 'out_of_stock' THEN 1 ELSE 0 END) as out_of_stock_products
      FROM sanpham
    `);

    // Get order stats
    const [orderStats] = await db.execute(`
      SELECT
        COUNT(*) as total_orders,
        SUM(TongGia) as total_revenue,
        SUM(CASE WHEN TrangThai = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN TrangThai = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
        SUM(CASE WHEN TrangThai = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN TrangThai = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
      FROM donhang
    `);

    // Get recent activity (last 7 days)
    const [recentActivity] = await db.execute(`
      SELECT
        COUNT(*) as new_users_7d,
        (SELECT COUNT(*) FROM sanpham WHERE CapNhat >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_products_7d,
        (SELECT COUNT(*) FROM donhang WHERE ThoiGianTao >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_orders_7d
      FROM nguoidung
      WHERE ThoiGianTao >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    const stats = {
      users: userStats[0] || {},
      products: productStats[0] || {},
      orders: orderStats[0] || {},
      recentActivity: recentActivity[0] || {},
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[ADMIN] Error getting dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard stats",
      error: error.message,
    });
  }
});

// User management
router.get("/users", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (search) {
      whereClause += " AND (HoTen LIKE ? OR Email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      whereClause += " AND VaiTro = ?";
      params.push(role);
    }

    if (status) {
      whereClause += " AND TrangThai = ?";
      params.push(status);
    }

    // Get users
    const [users] = await db.execute(
      `
      SELECT ID_NguoiDung, HoTen, Email, SoDienThoai, DiaChi, VaiTro, TrangThai, ThoiGianTao
      FROM nguoidung
      WHERE ${whereClause}
      ORDER BY ThoiGianTao DESC
      LIMIT ? OFFSET ?
    `,
      [...params, parseInt(limit), offset]
    );

    // Get total count
    const [countResult] = await db.execute(
      `
      SELECT COUNT(*) as total FROM nguoidung WHERE ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN] Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    });
  }
});

router.put("/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "block"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'active' or 'block'",
      });
    }

    await db.execute(
      "UPDATE nguoidung SET TrangThai = ? WHERE ID_NguoiDung = ?",
      [status, id]
    );

    res.json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM nguoidung WHERE ID_NguoiDung = ?", [id]);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

// Product management
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (search) {
      whereClause += " AND (TenSanPham LIKE ? OR MoTa LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += " AND TrangThai = ?";
      params.push(status);
    }

    const [products] = await db.execute(
      `
      SELECT
        sp.ID_SanPham,
        sp.TenSanPham,
        sp.Gia,
        sp.TonKho,
        sp.TrangThai,
        sp.CapNhat,
        u.HoTen as TenNguoiBan,
        dm.TenDanhMuc
      FROM sanpham sp
      JOIN nguoidung u ON sp.ID_NguoiBan = u.ID_NguoiDung
      JOIN danhmuc dm ON sp.ID_DanhMuc = dm.ID_DanhMuc
      WHERE ${whereClause}
      ORDER BY sp.CapNhat DESC
      LIMIT ? OFFSET ?
    `,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await db.execute(
      `
      SELECT COUNT(*) as total FROM sanpham sp WHERE ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN] Error getting products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
    });
  }
});

router.put("/products/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "out_of_stock"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await db.execute("UPDATE sanpham SET TrangThai = ? WHERE ID_SanPham = ?", [
      status,
      id,
    ]);

    res.json({
      success: true,
      message: "Product status updated successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Error updating product status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product status",
      error: error.message,
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM sanpham WHERE ID_SanPham = ?", [id]);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// Order management
router.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (status) {
      whereClause += " AND dh.TrangThai = ?";
      params.push(status);
    }

    const [orders] = await db.execute(
      `
      SELECT
        dh.ID_DonHang,
        dh.TongGia,
        dh.ThoiGianTao,
        dh.TrangThai,
        u.HoTen as TenNguoiMua,
        u.Email as EmailNguoiMua
      FROM donhang dh
      JOIN nguoidung u ON dh.ID_NguoiMua = u.ID_NguoiDung
      WHERE ${whereClause}
      ORDER BY dh.ThoiGianTao DESC
      LIMIT ? OFFSET ?
    `,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await db.execute(
      `
      SELECT COUNT(*) as total FROM donhang dh WHERE ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN] Error getting orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "shipped", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    await db.execute("UPDATE donhang SET TrangThai = ? WHERE ID_DonHang = ?", [
      status,
      id,
    ]);

    res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// Seller management
router.get("/sellers", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "u.VaiTro = 'seller'";
    const params = [];

    if (status) {
      whereClause += " AND u.TrangThai = ?";
      params.push(status);
    }

    const [sellers] = await db.execute(
      `
      SELECT
        u.ID_NguoiDung,
        u.HoTen,
        u.Email,
        u.SoDienThoai,
        u.TrangThai,
        u.ThoiGianTao,
        ch.TenCuaHang,
        ch.DiaChiCH,
        ch.SoDienThoaiCH,
        COUNT(sp.ID_SanPham) as SoLuongSanPham
      FROM nguoidung u
      LEFT JOIN cuahang ch ON u.ID_CuaHang = ch.ID_CuaHang
      LEFT JOIN sanpham sp ON u.ID_NguoiDung = sp.ID_NguoiBan
      WHERE ${whereClause}
      GROUP BY u.ID_NguoiDung, u.HoTen, u.Email, u.SoDienThoai, u.TrangThai, u.ThoiGianTao, ch.TenCuaHang, ch.DiaChiCH, ch.SoDienThoaiCH
      ORDER BY u.ThoiGianTao DESC
      LIMIT ? OFFSET ?
    `,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await db.execute(
      `
      SELECT COUNT(*) as total FROM nguoidung u WHERE ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        sellers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN] Error getting sellers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get sellers",
      error: error.message,
    });
  }
});

// Reports
router.get("/reports", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (status) {
      whereClause += " AND TrangThai = ?";
      params.push(status);
    }

    const [reports] = await db.execute(
      `
      SELECT
        bc.ID_BaoCao,
        bc.LoaiBaoCao,
        bc.LiDo,
        bc.TrangThai,
        bc.ThoiGianTao,
        nguoi_bc.HoTen as TenNguoiBaoCao,
        nguoi_bc.Email as EmailNguoiBaoCao,
        nguoi_bibc.HoTen as TenNguoiBiBaoCao,
        nguoi_bibc.Email as EmailNguoiBiBaoCao,
        sp.TenSanPham as TenSanPhamBiBaoCao
      FROM baocao bc
      LEFT JOIN nguoidung nguoi_bc ON bc.ID_NguoiBC = nguoi_bc.ID_NguoiDung
      LEFT JOIN nguoidung nguoi_bibc ON bc.ID_NguoiBiBC = nguoi_bibc.ID_NguoiDung
      LEFT JOIN sanpham sp ON bc.ID_SpBiBC = sp.ID_SanPham
      WHERE ${whereClause}
      ORDER BY bc.ThoiGianTao DESC
      LIMIT ? OFFSET ?
    `,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await db.execute(
      `
      SELECT COUNT(*) as total FROM baocao WHERE ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("[ADMIN] Error getting reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get reports",
      error: error.message,
    });
  }
});

router.put("/reports/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      "UPDATE baocao SET TrangThai = 'resolved' WHERE ID_BaoCao = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Report resolved successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Error resolving report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resolve report",
      error: error.message,
    });
  }
});

export default router;
