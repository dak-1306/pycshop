import jwt from "jsonwebtoken";

const sellerAuthMiddleware = (req, res, next) => {
  try {
    console.log(
      `🔑 [SELLER_AUTH] Authenticating request to ${req.originalUrl}`
    );

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("❌ [SELLER_AUTH] No authorization header provided");
      return res.status(401).json({
        error: "Access denied",
        message: "No token provided",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    if (!token) {
      console.log("❌ [SELLER_AUTH] Invalid token format");
      return res.status(401).json({
        error: "Access denied",
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      `🔍 [SELLER_AUTH] Token decoded for user: ${decoded.id}, role: ${decoded.role}`
    );

    if (
      !decoded.role ||
      (decoded.role !== "seller" && decoded.role !== "admin")
    ) {
      console.log(
        `❌ [SELLER_AUTH] Insufficient privileges. Role: ${decoded.role}`
      );
      return res.status(403).json({
        error: "Access denied",
        message: "Seller privileges required",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      userType: decoded.userType,
    };

    console.log(
      `✅ [SELLER_AUTH] Authentication successful for user: ${decoded.id}`
    );
    next();
  } catch (error) {
    console.error("❌ [SELLER_AUTH] Token verification failed:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Token is malformed",
        requireAuth: true,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        requireAuth: true,
        tokenExpired: true,
      });
    }

    return res.status(500).json({
      error: "Authentication error",
      message: "Internal server error during authentication",
    });
  }
};

export default sellerAuthMiddleware;
