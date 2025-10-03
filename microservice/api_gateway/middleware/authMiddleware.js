import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log(
        `🚫 [AUTH] No token provided for request: ${req.originalUrl}`
      );
      return res.status(401).json({
        success: false,
        error: "NO_TOKEN",
        message: "Vui lòng đăng nhập để tiếp tục",
        code: "NO_TOKEN",
        requireLogin: true,
      });
    }

    // Kiểm tra format: "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      console.log(
        `🚫 [AUTH] Invalid token format for request: ${req.originalUrl}`
      );
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN_FORMAT",
        message: "Token không đúng định dạng. Vui lòng đăng nhập lại.",
        code: "INVALID_TOKEN_FORMAT",
        requireLogin: true,
      });
    }

    // Verify token với secret key từ .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Thêm thông tin user vào request
    req.user = decoded;

    console.log(`✅ [AUTH] Token verified for user ID: ${decoded.id}`);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log(`⏰ [AUTH] Token expired for request: ${req.originalUrl}`);
      return res.status(401).json({
        success: false,
        error: "TOKEN_EXPIRED",
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        code: "TOKEN_EXPIRED",
        requireLogin: true,
      });
    }

    if (error.name === "JsonWebTokenError") {
      console.log(`🔒 [AUTH] Invalid token for request: ${req.originalUrl}`);
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN",
        message: "Token không hợp lệ. Vui lòng đăng nhập lại.",
        code: "INVALID_TOKEN",
        requireLogin: true,
      });
    }

    console.error("❌ [AUTH] Authentication error:", error);
    return res.status(500).json({
      success: false,
      error: "AUTHENTICATION_ERROR",
      message: "Lỗi xác thực hệ thống",
      code: "SERVER_ERROR",
    });
  }
};

export default authMiddleware;
