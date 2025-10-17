import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

dotenv.config();

const app = express();
const PORT = process.env.ADMIN_SERVICE_PORT || 5006;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000", 
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://127.0.0.1:5500"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization", 
    "x-user-id",
    "x-user-role",
    "x-user-type"
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to extract user info from headers (set by API Gateway) with JWT fallback
const extractUserFromHeaders = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const userType = req.headers['x-user-type'];
  
  if (userId && userRole) {
    req.user = {
      id: userId,
      role: userRole,
      userType: userType
    };
    console.log(`[ADMIN SERVICE] User extracted from headers:`, req.user);
    return next();
  }
  
  // Fallback: Try to extract from JWT token if headers are missing
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = {
        id: decoded.id || decoded.userId,
        role: decoded.role || 'admin',
        userType: decoded.userType || 'admin'
      };
      console.log(`[ADMIN SERVICE] User extracted from JWT:`, req.user);
      return next();
    } catch (jwtError) {
      console.log(`[ADMIN SERVICE] JWT verification failed:`, jwtError.message);
    }
  }
  
  console.log(`[ADMIN SERVICE] No user headers or valid JWT found`);
  next();
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  console.log(`[ADMIN SERVICE] Checking admin role for user:`, req.user);
  
  if (!req.user || req.user.role !== "admin") {
    console.log(`[ADMIN SERVICE] Access denied - not admin role`);
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  
  console.log(`[ADMIN SERVICE] Admin access granted`);
  next();
};

// Apply middlewares to all routes
app.use(extractUserFromHeaders);
app.use(requireAdmin);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Admin Service is running",
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats
app.get("/dashboard/stats", async (req, res) => {
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

    // Get order stats (handle case where donhang table might not exist or be empty)
    let orderStats = [{
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0,
      confirmed_orders: 0,
      shipped_orders: 0,
      cancelled_orders: 0
    }];

    try {
      const [orders] = await db.execute(`
        SELECT
          COUNT(*) as total_orders,
          COALESCE(SUM(TongGia), 0) as total_revenue,
          SUM(CASE WHEN TrangThai = 'pending' THEN 1 ELSE 0 END) as pending_orders,
          SUM(CASE WHEN TrangThai = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
          SUM(CASE WHEN TrangThai = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
          SUM(CASE WHEN TrangThai = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
        FROM donhang
      `);
      orderStats = orders;
    } catch (orderError) {
      console.warn("[ADMIN] Could not fetch order stats:", orderError.message);
    }

    // Get recent activity (last 7 days)
    const [recentActivity] = await db.execute(`
      SELECT
        COUNT(*) as new_users_7d,
        (SELECT COUNT(*) FROM sanpham WHERE CapNhat >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as new_products_7d
      FROM nguoidung
      WHERE ThoiGianTao >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    // Add new_orders_7d with fallback
    let newOrders7d = 0;
    try {
      const [newOrdersResult] = await db.execute(`
        SELECT COUNT(*) as new_orders_7d FROM donhang WHERE ThoiGianTao >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `);
      newOrders7d = newOrdersResult[0]?.new_orders_7d || 0;
    } catch (orderError) {
      console.warn("[ADMIN] Could not fetch recent orders:", orderError.message);
    }

    const stats = {
      totalOrders: orderStats[0]?.total_orders || 0,
      totalRevenue: orderStats[0]?.total_revenue || 0,
      totalProducts: productStats[0]?.total_products || 0,
      totalUsers: userStats[0]?.total_users || 0,
    };

    const recentOrders = [];
    const recentUsers = [];
    
    // Try to get recent orders
    try {
      const [orders] = await db.execute(`
        SELECT
          dh.ID_DonHang as id,
          dh.TongGia as total,
          dh.ThoiGianTao as created_at,
          dh.TrangThai as status,
          u.HoTen as customer_name
        FROM donhang dh
        JOIN nguoidung u ON dh.ID_NguoiMua = u.ID_NguoiDung
        ORDER BY dh.ThoiGianTao DESC
        LIMIT 10
      `);
      recentOrders.push(...orders);
    } catch (orderError) {
      console.warn("[ADMIN] Could not fetch recent orders list:", orderError.message);
    }

    // Get recent users
    try {
      const [users] = await db.execute(`
        SELECT
          ID_NguoiDung as id,
          HoTen as name,
          Email as email,
          VaiTro as role,
          TrangThai as status,
          ThoiGianTao as joinDate,
          ThoiGianTao as lastLogin
        FROM nguoidung
        ORDER BY ThoiGianTao DESC
        LIMIT 10
      `);
      recentUsers.push(...users);
    } catch (userError) {
      console.warn("[ADMIN] Could not fetch recent users:", userError.message);
    }

    // Mock chart data for now
    const chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [12000, 19000, 3000, 5000, 2000, 3000],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    };

    res.json({
      success: true,
      stats,
      recentOrders,
      recentUsers,
      chartData,
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
app.get("/users", async (req, res) => {
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
      SELECT ID_NguoiDung as id, HoTen as name, Email as email, SoDienThoai as phone, 
             DiaChi as address, VaiTro as role, TrangThai as status, 
             ThoiGianTao as joinDate, ThoiGianTao as lastLogin
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
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
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

app.put("/users/:id/status", async (req, res) => {
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

app.delete("/users/:id", async (req, res) => {
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

// Create new user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role, status, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check if email already exists
    const [existingUser] = await db.execute(
      "SELECT ID_NguoiDung FROM nguoidung WHERE Email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password (in production, use bcrypt)
    const hashedPassword = password; // For now, storing as plain text - should be hashed

    // Insert new user
    const [result] = await db.execute(
      `INSERT INTO nguoidung (HoTen, Email, MatKhau, VaiTro, TrangThai, SoDienThoai, DiaChi, ThoiGianTao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        email,
        hashedPassword,
        role || 'customer',
        status || 'active',
        phone || null,
        address || null
      ]
    );

    // Get the created user
    const [newUser] = await db.execute(
      `SELECT ID_NguoiDung as id, HoTen as name, Email as email, SoDienThoai as phone, 
              DiaChi as address, VaiTro as role, TrangThai as status, ThoiGianTao as joinDate
       FROM nguoidung WHERE ID_NguoiDung = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser[0]
    });

  } catch (error) {
    console.error("[ADMIN] Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.execute(
      `SELECT ID_NguoiDung as id, HoTen as name, Email as email, SoDienThoai as phone, 
              DiaChi as address, VaiTro as role, TrangThai as status, 
              ThoiGianTao as joinDate, ThoiGianTao as lastLogin
       FROM nguoidung WHERE ID_NguoiDung = ?`,
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user[0]
    });

  } catch (error) {
    console.error("[ADMIN] Error getting user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role, status } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email already exists for other users
    const [existingUser] = await db.execute(
      "SELECT ID_NguoiDung FROM nguoidung WHERE Email = ? AND ID_NguoiDung != ?",
      [email, id]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Update user
    await db.execute(
      `UPDATE nguoidung 
       SET HoTen = ?, Email = ?, SoDienThoai = ?, DiaChi = ?, VaiTro = ?, TrangThai = ?
       WHERE ID_NguoiDung = ?`,
      [name, email, phone || null, address || null, role || 'customer', status || 'active', id]
    );

    // Get updated user
    const [updatedUser] = await db.execute(
      `SELECT ID_NguoiDung as id, HoTen as name, Email as email, SoDienThoai as phone, 
              DiaChi as address, VaiTro as role, TrangThai as status, ThoiGianTao as joinDate
       FROM nguoidung WHERE ID_NguoiDung = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser[0]
    });

  } catch (error) {
    console.error("[ADMIN] Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
});

// Product management
app.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (search) {
      whereClause += " AND (sp.TenSanPham LIKE ? OR sp.MoTa LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += " AND sp.TrangThai = ?";
      params.push(status);
    }

    const [products] = await db.execute(
      `
      SELECT
        sp.ID_SanPham as id,
        sp.TenSanPham as name,
        sp.Gia as price,
        sp.TonKho as stock,
        sp.TrangThai as status,
        sp.CapNhat as updated_at,
        u.HoTen as seller_name,
        dm.TenDanhMuc as category
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
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
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

app.put("/products/:id/status", async (req, res) => {
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

app.delete("/products/:id", async (req, res) => {
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
app.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (status) {
      whereClause += " AND dh.TrangThai = ?";
      params.push(status);
    }

    // Check if donhang table exists and has data
    let orders = [];
    let total = 0;

    try {
      const [orderResults] = await db.execute(
        `
        SELECT
          dh.ID_DonHang as id,
          dh.TongGia as total_amount,
          dh.ThoiGianTao as created_at,
          dh.TrangThai as status,
          u.HoTen as customer_name,
          u.Email as customer_email
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

      orders = orderResults;
      total = countResult[0].total;
    } catch (error) {
      console.warn("[ADMIN] Orders table may not exist or be empty:", error.message);
    }

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
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

app.put("/orders/:id/status", async (req, res) => {
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
app.get("/sellers", async (req, res) => {
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
        u.ID_NguoiDung as id,
        u.HoTen as name,
        u.Email as email,
        u.SoDienThoai as phone,
        u.TrangThai as status,
        u.ThoiGianTao as joinDate,
        ch.TenCuaHang as shopName,
        ch.DiaChiCH as shopAddress,
        ch.SoDienThoaiCH as shopPhone,
        COUNT(sp.ID_SanPham) as totalProducts
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
      data: sellers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
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

// Reports management
app.get("/reports", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const params = [];

    if (status) {
      whereClause += " AND TrangThai = ?";
      params.push(status);
    }

    // Check if baocao table exists
    let reports = [];
    let total = 0;

    try {
      const [reportResults] = await db.execute(
        `
        SELECT
          bc.ID_BaoCao as id,
          bc.LoaiBaoCao as type,
          bc.LiDo as reason,
          bc.TrangThai as status,
          bc.ThoiGianTao as created_at,
          nguoi_bc.HoTen as reporter_name,
          nguoi_bc.Email as reporter_email,
          nguoi_bibc.HoTen as reported_user_name,
          nguoi_bibc.Email as reported_user_email,
          sp.TenSanPham as reported_product_name
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

      reports = reportResults;
      total = countResult[0].total;
    } catch (error) {
      console.warn("[ADMIN] Reports table may not exist:", error.message);
    }

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
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

app.put("/reports/:id/resolve", async (req, res) => {
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

// Super Admin only - Create new admin
app.post("/create-admin", async (req, res) => {
  try {
    console.log(`[ADMIN SERVICE] Create admin request from user:`, req.user);
      // Only allow super admin (testadmin@pycshop.com) to create new admins
    const currentUserEmail = req.headers['x-user-email'] || req.user?.email;
    if (currentUserEmail !== 'testadmin@pycshop.com') {
      return res.status(403).json({
        success: false,
        message: "Chỉ Super Admin mới có thể tạo tài khoản admin mới",
      });
    }

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin (tên, email, mật khẩu)",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không đúng định dạng",
      });
    }

    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      "SELECT * FROM admin WHERE Email = ?",
      [email]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được sử dụng cho tài khoản admin khác",
      });
    }

    // Check if email exists in user table
    const [existingUser] = await db.execute(
      "SELECT * FROM nguoidung WHERE Email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được sử dụng cho tài khoản người dùng",
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const [result] = await db.execute(
      "INSERT INTO admin (HoTen, Email, MatKhau) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    console.log(`[ADMIN SERVICE] New admin created successfully:`, {
      id: result.insertId,
      name,
      email
    });

    res.json({
      success: true,
      message: "Tạo tài khoản admin mới thành công",
      data: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (error) {
    console.error("[ADMIN SERVICE] Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi tạo tài khoản admin",
      error: error.message,
    });
  }
});

// Get all admins (Super Admin only)
app.get("/admins", async (req, res) => {
  try {
    // Only allow super admin to view admin list
    const currentUserEmail = req.headers['x-user-email'] || req.user?.email;
    if (currentUserEmail !== 'dat@gmail.com') {
      return res.status(403).json({
        success: false,
        message: "Chỉ Super Admin mới có thể xem danh sách admin",
      });
    }

    const [admins] = await db.execute(`
      SELECT 
        ID_NguoiDung as id,
        HoTen as name, 
        Email as email,
        'admin' as role,
        'active' as status,
        CURRENT_TIMESTAMP as created_at
      FROM admin 
      ORDER BY ID_NguoiDung ASC
    `);

    res.json({
      success: true,
      data: admins
    });

  } catch (error) {
    console.error("[ADMIN SERVICE] Error getting admins:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi lấy danh sách admin",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    service: "Admin Service",
    timestamp: new Date().toISOString()
  });
});

// Chart data endpoints
app.get("/charts/revenue", async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    
    // Get revenue data based on period
    let dateFormat, groupBy;
    switch(period) {
      case "yearly":
        dateFormat = "%Y";
        groupBy = "YEAR(created_at)";
        break;
      case "weekly":
        dateFormat = "%Y-%u";
        groupBy = "YEARWEEK(created_at)";
        break;
      default: // monthly
        dateFormat = "%Y-%m";
        groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
    }

    const query = `
      SELECT 
        ${groupBy} as period,
        SUM(TongTien) as value,
        COUNT(*) as order_count
      FROM DonHang 
      WHERE TrangThai = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY ${groupBy}
      ORDER BY period ASC
      LIMIT 12
    `;

    const results = await db.execute(query);
    
    // Format data for chart
    const chartData = results.map((row, index) => ({
      month: `T${index + 1}`,
      value: parseInt(row.value) || 0
    }));

    res.json(chartData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching revenue chart data:", error);
    res.status(500).json({ error: "Failed to fetch revenue data" });
  }
});

app.get("/charts/orders", async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    
    let dateFormat, groupBy;
    switch(period) {
      case "yearly":
        dateFormat = "%Y";
        groupBy = "YEAR(created_at)";
        break;
      case "weekly":
        dateFormat = "%Y-%u";
        groupBy = "YEARWEEK(created_at)";
        break;
      default: // monthly
        dateFormat = "%Y-%m";
        groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
    }

    const query = `
      SELECT 
        ${groupBy} as period,
        COUNT(*) as value
      FROM DonHang 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY ${groupBy}
      ORDER BY period ASC
      LIMIT 12
    `;

    const results = await db.execute(query);
    
    const chartData = results.map((row, index) => ({
      month: `T${index + 1}`,
      value: parseInt(row.value) || 0
    }));

    res.json(chartData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching orders chart data:", error);
    res.status(500).json({ error: "Failed to fetch orders data" });
  }
});

app.get("/charts/user-analytics", async (req, res) => {
  try {
    const queries = [
      "SELECT COUNT(*) as count FROM NguoiDung WHERE VaiTro = 'buyer'",
      "SELECT COUNT(*) as count FROM NguoiDung WHERE VaiTro = 'seller'", 
      "SELECT COUNT(*) as count FROM NguoiDung WHERE VaiTro = 'admin'"
    ];

    const results = await Promise.all(
      queries.map(query => db.execute(query))
    );

    const totalUsers = results.reduce((sum, result) => sum + result[0].count, 0);
    
    const chartData = [
      { 
        name: "Người mua", 
        value: Math.round((results[0][0].count / totalUsers) * 100),
        color: "#3b82f6" 
      },
      { 
        name: "Người bán", 
        value: Math.round((results[1][0].count / totalUsers) * 100),
        color: "#10b981" 
      },
      { 
        name: "Admin", 
        value: Math.round((results[2][0].count / totalUsers) * 100),
        color: "#f59e0b" 
      }
    ];

    res.json(chartData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching user analytics data:", error);
    res.status(500).json({ error: "Failed to fetch user analytics data" });
  }
});

app.get("/charts/category-performance", async (req, res) => {
  try {
    const query = `
      SELECT 
        dm.TenDanhMuc as category,
        COUNT(DISTINCT sp.ID_SanPham) as sales,
        COALESCE(SUM(ct.SoLuong * ct.Gia), 0) as revenue
      FROM DanhMuc dm
      LEFT JOIN SanPham sp ON dm.ID_DanhMuc = sp.ID_DanhMuc
      LEFT JOIN ChiTietDonHang ct ON sp.ID_SanPham = ct.ID_SanPham
      LEFT JOIN DonHang dh ON ct.ID_DonHang = dh.ID_DonHang AND dh.TrangThai = 'completed'
      GROUP BY dm.ID_DanhMuc, dm.TenDanhMuc
      ORDER BY revenue DESC
      LIMIT 6
    `;

    const results = await db.execute(query);
    
    const chartData = results.map(row => ({
      category: row.category,
      sales: parseInt(row.sales) || 0,
      revenue: parseInt(row.revenue) || 0
    }));

    res.json(chartData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching category performance data:", error);
    res.status(500).json({ error: "Failed to fetch category performance data" });
  }
});

app.get("/charts/all", async (req, res) => {
  try {
    // Fetch all chart data in parallel
    const [revenueResponse, ordersResponse, userAnalyticsResponse, categoryResponse] = await Promise.all([
      fetch(`http://localhost:${PORT}/charts/revenue`).then(r => r.json()),
      fetch(`http://localhost:${PORT}/charts/orders`).then(r => r.json()),
      fetch(`http://localhost:${PORT}/charts/user-analytics`).then(r => r.json()),
      fetch(`http://localhost:${PORT}/charts/category-performance`).then(r => r.json())
    ]);

    const allChartsData = {
      revenue: revenueResponse,
      orders: ordersResponse,
      userAnalytics: userAnalyticsResponse,
      categoryPerformance: categoryResponse
    };

    res.json(allChartsData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching all charts data:", error);
    res.status(500).json({ error: "Failed to fetch charts data" });
  }
});

// Chart data endpoints
app.get("/charts/revenue", async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    
    // Mock data for now since DonHang table structure may vary
    const mockData = [
      { month: "T1", value: 2100000000 },
      { month: "T2", value: 2350000000 },
      { month: "T3", value: 2200000000 },
      { month: "T4", value: 2680000000 },
      { month: "T5", value: 2900000000 },
      { month: "T6", value: 3200000000 },
      { month: "T7", value: 2950000000 },
      { month: "T8", value: 3100000000 },
      { month: "T9", value: 2850000000 },
      { month: "T10", value: 2845600000 },
    ];

    res.json(mockData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching revenue chart data:", error);
    res.status(500).json({ error: "Failed to fetch revenue data" });
  }
});

app.get("/charts/orders", async (req, res) => {
  try {
    const mockData = [
      { month: "T1", value: 645 },
      { month: "T2", value: 720 },
      { month: "T3", value: 680 },
      { month: "T4", value: 790 },
      { month: "T5", value: 850 },
      { month: "T6", value: 920 },
      { month: "T7", value: 880 },
      { month: "T8", value: 940 },
      { month: "T9", value: 820 },
      { month: "T10", value: 856 },
    ];

    res.json(mockData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching orders chart data:", error);
    res.status(500).json({ error: "Failed to fetch orders data" });
  }
});

app.get("/charts/user-analytics", async (req, res) => {
  try {
    const queries = [
      "SELECT COUNT(*) as count FROM nguoidung WHERE VaiTro = 'buyer'",
      "SELECT COUNT(*) as count FROM nguoidung WHERE VaiTro = 'seller'", 
      "SELECT COUNT(*) as count FROM nguoidung WHERE VaiTro = 'admin'"
    ];

    const results = await Promise.all(
      queries.map(query => db.execute(query))
    );

    const totalUsers = results.reduce((sum, result) => sum + (result[0]?.count || 0), 0);
    
    if (totalUsers === 0) {
      // Return default data if no users found
      const defaultData = [
        { name: "Người mua", value: 68, color: "#3b82f6" },
        { name: "Người bán", value: 22, color: "#10b981" },
        { name: "Admin", value: 10, color: "#f59e0b" },
      ];
      return res.json(defaultData);
    }
    
    const chartData = [
      { 
        name: "Người mua", 
        value: Math.round(((results[0][0]?.count || 0) / totalUsers) * 100),
        color: "#3b82f6" 
      },
      { 
        name: "Người bán", 
        value: Math.round(((results[1][0]?.count || 0) / totalUsers) * 100),
        color: "#10b981" 
      },
      { 
        name: "Admin", 
        value: Math.round(((results[2][0]?.count || 0) / totalUsers) * 100),
        color: "#f59e0b" 
      }
    ];

    res.json(chartData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching user analytics data:", error);
    // Return default data on error
    const defaultData = [
      { name: "Người mua", value: 68, color: "#3b82f6" },
      { name: "Người bán", value: 22, color: "#10b981" },
      { name: "Admin", value: 10, color: "#f59e0b" },
    ];
    res.json(defaultData);
  }
});

app.get("/charts/category-performance", async (req, res) => {
  try {
    // Mock data for category performance
    const mockData = [
      { category: "Điện tử", sales: 1250, revenue: 2800000000 },
      { category: "Thời trang", sales: 980, revenue: 1900000000 },
      { category: "Gia dụng", sales: 750, revenue: 1200000000 },
      { category: "Sách", sales: 420, revenue: 350000000 },
      { category: "Thể thao", sales: 680, revenue: 950000000 },
      { category: "Làm đẹp", sales: 890, revenue: 1450000000 },
    ];

    res.json(mockData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching category performance data:", error);
    res.status(500).json({ error: "Failed to fetch category performance data" });
  }
});

app.get("/charts/user-activity", async (req, res) => {
  try {
    // Mock user activity data
    const mockData = [
      { time: "00:00", users: 120, sessions: 89 },
      { time: "03:00", users: 95, sessions: 62 },
      { time: "06:00", users: 180, sessions: 134 },
      { time: "09:00", users: 380, sessions: 289 },
      { time: "12:00", users: 520, sessions: 412 },
      { time: "15:00", users: 480, sessions: 378 },
      { time: "18:00", users: 640, sessions: 498 },
      { time: "21:00", users: 580, sessions: 445 },
    ];

    res.json(mockData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching user activity data:", error);
    res.status(500).json({ error: "Failed to fetch user activity data" });
  }
});

app.get("/charts/all", async (req, res) => {
  try {
    // Get all chart data from individual endpoints
    const baseUrl = `http://localhost:${PORT}`;
    
    const [revenueRes, ordersRes, userAnalyticsRes, userActivityRes, categoryRes] = await Promise.all([
      fetch(`${baseUrl}/charts/revenue`),
      fetch(`${baseUrl}/charts/orders`),
      fetch(`${baseUrl}/charts/user-analytics`),
      fetch(`${baseUrl}/charts/user-activity`),
      fetch(`${baseUrl}/charts/category-performance`)
    ]);

    const [revenue, orders, userAnalytics, userActivity, categoryPerformance] = await Promise.all([
      revenueRes.json(),
      ordersRes.json(),
      userAnalyticsRes.json(),
      userActivityRes.json(),
      categoryRes.json()
    ]);

    const allChartsData = {
      revenue,
      orders,
      userAnalytics,
      userActivity,
      categoryPerformance
    };

    res.json(allChartsData);
  } catch (error) {
    console.error("[ADMIN SERVICE] Error fetching all charts data:", error);
    // Return mock data on error
    const mockChartsData = {
      revenue: [
        { month: "T1", value: 2100000000 },
        { month: "T2", value: 2350000000 },
        { month: "T3", value: 2200000000 },
        { month: "T4", value: 2680000000 },
        { month: "T5", value: 2900000000 },
        { month: "T6", value: 3200000000 },
        { month: "T7", value: 2950000000 },
        { month: "T8", value: 3100000000 },
        { month: "T9", value: 2850000000 },
        { month: "T10", value: 2845600000 },
      ],
      orders: [
        { month: "T1", value: 645 },
        { month: "T2", value: 720 },
        { month: "T3", value: 680 },
        { month: "T4", value: 790 },
        { month: "T5", value: 850 },
        { month: "T6", value: 920 },
        { month: "T7", value: 880 },
        { month: "T8", value: 940 },
        { month: "T9", value: 820 },
        { month: "T10", value: 856 },
      ],      userAnalytics: [
        { name: "Người mua", value: 68, color: "#3b82f6" },
        { name: "Người bán", value: 22, color: "#10b981" },
        { name: "Admin", value: 10, color: "#f59e0b" },
      ],
      userActivity: [
        { time: "00:00", users: 120, sessions: 89 },
        { time: "03:00", users: 95, sessions: 62 },
        { time: "06:00", users: 180, sessions: 134 },
        { time: "09:00", users: 380, sessions: 289 },
        { time: "12:00", users: 520, sessions: 412 },
        { time: "15:00", users: 480, sessions: 378 },
        { time: "18:00", users: 640, sessions: 498 },
        { time: "21:00", users: 580, sessions: 445 },
      ],
      categoryPerformance: [
        { category: "Điện tử", sales: 1250, revenue: 2800000000 },
        { category: "Thời trang", sales: 980, revenue: 1900000000 },
        { category: "Gia dụng", sales: 750, revenue: 1200000000 },
        { category: "Sách", sales: 420, revenue: 350000000 },
        { category: "Thể thao", sales: 680, revenue: 950000000 },
        { category: "Làm đẹp", sales: 890, revenue: 1450000000 },
      ],
    };
    res.json(mockChartsData);
  }
});

// Enhanced users management endpoint with better error handling
app.get('/users', async (req, res) => {
  try {
    console.log(`[ADMIN SERVICE] Getting users with params:`, req.query);
    
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['id', 'email', 'name', 'created_at', 'updated_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Try to get data from nguoidung table first, fallback to mock data
    let total = 0;
    let userData = [];
    
    try {
      // Build WHERE conditions for nguoidung table
      let whereConditions = ['1=1'];
      let queryParams = [];
      
      if (search) {
        whereConditions.push('(HoTen LIKE ? OR Email LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`);
      }
      
      if (role) {
        whereConditions.push('VaiTro = ?');
        queryParams.push(role);
      }
      
      if (status) {
        whereConditions.push('TrangThai = ?');
        queryParams.push(status);
      }

      const whereClause = whereConditions.join(' AND ');

      // Get count
      const countQuery = `SELECT COUNT(*) as total FROM nguoidung WHERE ${whereClause}`;
      const [countResult] = await db.execute(countQuery, queryParams);
      total = countResult[0].total;

      // Get users data
      const usersQuery = `
        SELECT 
          ID_NguoiDung as id,
          Email as email,
          HoTen as name,
          VaiTro as role,
          TrangThai as status,
          ThoiGianTao as created_at,
          ThoiGianTao as updated_at,
          ThoiGianTao as last_login
        FROM nguoidung 
        WHERE ${whereClause}
        ORDER BY ThoiGianTao ${safeSortOrder}
        LIMIT ? OFFSET ?
      `;

      const finalParams = [...queryParams, parseInt(limit), parseInt(offset)];
      const [result] = await db.execute(usersQuery, finalParams);
      userData = result;
      
    } catch (dbError) {
      console.log(`[ADMIN SERVICE] Database error, using mock data:`, dbError.message);
      
      // Fallback to mock data if database query fails
      const mockUsers = [
        {
          id: 1,
          email: 'admin@admin.com',
          name: 'System Admin',
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        },
        {
          id: 2,
          email: 'user@example.com', 
          name: 'Test User',
          role: 'customer',
          status: 'active',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          last_login: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      userData = mockUsers.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
      total = mockUsers.length;
    }
    
    console.log(`[ADMIN SERVICE] Found ${userData.length} users, total: ${total}`);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users: userData,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('[ADMIN SERVICE] Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách người dùng',
      error: error.message
    });
  }
});

// Mock notifications endpoint  
app.get('/notifications', extractUserFromHeaders, requireAdmin, async (req, res) => {
  try {
    console.log(`[ADMIN SERVICE] Getting notifications for user:`, req.user);
    
    // Mock notifications data since we don't have a notifications table
    const mockNotifications = [
      {
        id: 1,
        title: 'Đơn hàng mới',
        message: 'Có 5 đơn hàng mới cần xử lý',
        type: 'order',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,  
        title: 'Người dùng mới',
        message: 'Có 3 người dùng mới đăng ký',
        type: 'user',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 3,
        title: 'Báo cáo doanh thu',
        message: 'Báo cáo doanh thu tháng đã sẵn sàng',
        type: 'report', 
        read: true,
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: {
        notifications: mockNotifications,
        unreadCount: mockNotifications.filter(n => !n.read).length
      }
    });

  } catch (error) {
    console.error('[ADMIN SERVICE] Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông báo',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[ADMIN SERVICE] Server running on port ${PORT}`);
  console.log(`[ADMIN SERVICE] Health check: http://localhost:${PORT}/health`);
});

export default app;
