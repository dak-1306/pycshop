// api-gateway/index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import setupRoutes from "./routes/index.js"; // Import routes

const app = express();

// Middleware cơ bản
app.use(cors({ origin: `http://localhost:${process.env.PORT || 5000}` }));
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
