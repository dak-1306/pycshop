import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token không được cung cấp",
      });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("❌ [AUTH_MIDDLEWARE] Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

// Middleware to check if user is seller
export const requireSeller = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Bạn cần phải là seller để thực hiện hành động này",
    });
  }
  next();
};

// Middleware to check if user is buyer (for becoming seller)
export const requireBuyer = (req, res, next) => {
  if (!req.user || req.user.role !== "buyer") {
    return res.status(403).json({
      success: false,
      message: "Chỉ buyer mới có thể trở thành seller",
    });
  }
  next();
};

// CORS middleware for shop service
export const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-User-Id, X-User-Role"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers["user-agent"] || "Unknown";

  console.log(
    `[SHOP_SERVICE] ${timestamp} - ${method} ${url} - User-Agent: ${userAgent}`
  );

  next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("❌ [SHOP_SERVICE] Error:", err);

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token đã hết hạn",
    });
  }

  // Database errors
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu đã tồn tại",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Lỗi server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
