import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied",
        message: "No token provided",
      });
    }

    // Kiểm tra format: "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: "Access denied",
        message: "Invalid token format",
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
      return res.status(401).json({
        error: "Token expired",
        message: "Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Token verification failed",
      });
    }

    console.error("❌ [AUTH] Authentication error:", error);
    return res.status(500).json({
      error: "Authentication error",
      message: "Internal server error",
    });
  }
};

export default authMiddleware;
