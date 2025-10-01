// api-gateway/index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import setupRoutes from "./routes.js"; // Import routes
import authMiddleware from "./middleware/authMiddleware.js"; // Import auth middleware

const app = express();

// CORS configuration with security - chỉ cho phép specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000", // React dev server
      "http://localhost:5000", // API Gateway (same-origin)
      "http://127.0.0.1:5500", // Live Server
      "http://127.0.0.1:3000", // Alternative local
      "http://localhost:8080", // Alternative dev server
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Cho phép cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200, // Support legacy browsers
};

console.log("[GATEWAY] CORS allowed origins:", allowedOrigins);

// Middleware cơ bản
app.use(cors(corsOptions));
app.use(helmet());

// Skip parsing for proxy routes giữ nguyên raw data cho proxy
app.use((req, res, next) => {
  if (
    req.url.startsWith("/auth") ||
    req.url.startsWith("/products") ||
    req.url.startsWith("/cart")
  ) {
    console.log(`[GATEWAY] Skipping JSON parsing for proxy route: ${req.url}`);
    return next();
  }
  express.json()(req, res, next);
});

app.use(morgan("dev"));

// Rate limiter (chống DDoS: max 100 request / 15 phút / 1 IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100,
  message: { message: "Too many requests, please try again later." },
});

app.use(limiter);

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[GATEWAY] Incoming ${req.method} ${req.originalUrl}`);
  console.log(`[GATEWAY] Request body:`, req.body);
  next();
});

// Middleware kiểm tra auth cho các routes protected
app.use((req, res, next) => {
  // Routes không cần auth (public routes)
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/products", // Cho phép xem sản phẩm không cần đăng nhập
  ];

  // Kiểm tra nếu là public route
  const isPublicRoute = publicRoutes.some((route) =>
    req.originalUrl.startsWith(route)
  );

  if (isPublicRoute) {
    console.log(`[GATEWAY] Public route: ${req.originalUrl}`);
    return next();
  }

  // Áp dụng auth middleware cho protected routes
  console.log(
    `[GATEWAY] Protected route: ${req.originalUrl} - Checking token...`
  );
  authMiddleware(req, res, next);
});

// Đăng ký các route proxy
setupRoutes(app);

// Log after proxy setup
app.use((req, res, next) => {
  console.log(`[GATEWAY] Unhandled request: ${req.method} ${req.originalUrl}`);
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.error("[GATEWAY] Error:", err);
  res.status(500).json({ error: "Gateway error", details: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway chạy tại http://localhost:${PORT}`);
});
