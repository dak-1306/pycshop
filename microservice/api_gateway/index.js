// api-gateway/index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
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
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Vite dev server (backup port)
      "http://localhost:5175", // Vite dev server (backup port)
    ];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(`[GATEWAY] Checking origin: ${origin}`);

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      console.log(`[GATEWAY] Allowing request with no origin`);
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`[GATEWAY] Allowing origin: ${origin}`);
      return callback(null, true);
    } else {
      console.log(`[GATEWAY] CORS blocked origin: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // Cho phép cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200, // Support legacy browsers
  preflightContinue: false,
};

console.log("[GATEWAY] CORS allowed origins:", allowedOrigins);

// Middleware cơ bản
app.use(helmet());

// Log all requests first
app.use((req, res, next) => {
  console.log(
    `[GATEWAY] ${req.method} ${req.originalUrl} from origin: ${req.headers.origin}`
  );
  next();
});

// Handle OPTIONS requests explicitly before CORS middleware
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept, Origin"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      console.log(`[GATEWAY] Handled OPTIONS request for origin: ${origin}`);
      return res.status(200).end();
    }
  }
  next();
});

app.use(cors(corsOptions));

// Additional CORS middleware to ensure headers are always set
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[GATEWAY] Setting CORS headers for origin: ${origin}`);
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    console.log(`[GATEWAY] CORS headers set for origin: ${origin}`);
  }
  next();
});

// Skip parsing for proxy routes giữ nguyên raw data cho proxy
app.use((req, res, next) => {
  if (
    req.url.startsWith("/auth") ||
    req.url.startsWith("/products") ||
    req.url.startsWith("/seller") ||
    req.url.startsWith("/shops") ||
    req.url.startsWith("/cart") ||
    req.url.startsWith("/api/reviews") ||
    req.url.includes("/reviews")
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

// Add timeout middleware
app.use((req, res, next) => {
  // Set timeout for all requests
  req.setTimeout(60000, () => {
    console.log(
      `[GATEWAY] Request timeout for ${req.method} ${req.originalUrl}`
    );
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: "Request timeout",
        error: "The request took too long to process",
      });
    }
  });

  res.setTimeout(60000, () => {
    console.log(
      `[GATEWAY] Response timeout for ${req.method} ${req.originalUrl}`
    );
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: "Response timeout",
        error: "The response took too long to send",
      });
    }
  });

  next();
});

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[GATEWAY] Incoming ${req.method} ${req.originalUrl}`);
  console.log(`[GATEWAY] Request body:`, req.body);
  next();
});

// Parse JWT token and add user info to request (but don't require auth)
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`[GATEWAY] JWT decoded for user ID: ${decoded.id}`);
      }
    } catch (error) {
      // Don't fail - just log and continue without user info
      console.log(`[GATEWAY] JWT parse error (continuing):`, error.message);
    }
  }

  next();
});

// Middleware kiểm tra auth cho các routes protected
app.use((req, res, next) => {
  // Routes không cần auth (public routes)
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/products", // Cho phép xem sản phẩm không cần đăng nhập
    "/uploads", // Static files (product images)
  ];

  // Review public routes - allow viewing reviews without authentication
  const reviewPublicRoutes = [
    "/api/products", // Allow GET /api/products/:id/reviews
  ];

  // Shop public routes
  const shopPublicRoutes = [
    "/shops/categories",
    "/shops/search",
    "/shops/category",
    "/shops/health",
  ];

  // Combine all public routes
  const allPublicRoutes = [
    ...publicRoutes,
    ...reviewPublicRoutes,
    ...shopPublicRoutes,
  ];

  // Kiểm tra nếu là public route
  const isPublicRoute = allPublicRoutes.some((route) =>
    req.originalUrl.startsWith(route)
  );

  // Special case: Allow GET requests to review endpoints without authentication
  const isReviewGetRoute =
    req.originalUrl.includes("/reviews") && req.method === "GET";

  // Debug logs
  console.log(`[GATEWAY] Checking route: ${req.originalUrl}`);
  console.log(`[GATEWAY] Public routes:`, allPublicRoutes);
  console.log(`[GATEWAY] Is public route:`, isPublicRoute);
  console.log(`[GATEWAY] Is review GET route:`, isReviewGetRoute);

  // Kiểm tra nếu là shop route với ID (GET /shops/123)
  const isShopByIdRoute =
    /^\/shops\/\d+$/.test(req.originalUrl) && req.method === "GET";

  if (isPublicRoute || isShopByIdRoute || isReviewGetRoute) {
    console.log(`[GATEWAY] Public route allowed: ${req.originalUrl}`);
    return next();
  }

  // Áp dụng auth middleware cho protected routes
  console.log(
    `[GATEWAY] Protected route: ${req.originalUrl} - Checking token...`
  );
  authMiddleware(req, res, next);
});

// Add specific route for reviews BEFORE setupRoutes - Handle all HTTP methods
app.all(/^\/api\/products\/\d+\/reviews/, (req, res) => {
  console.log(
    `[GATEWAY] Review route matched: ${req.method} ${req.originalUrl}`
  );

  // Proxy to review service
  const reviewServiceUrl = "http://localhost:5005";
  const targetUrl = `${reviewServiceUrl}${req.originalUrl}`;

  console.log(`[GATEWAY] Proxying to: ${targetUrl}`);

  // For GET requests, proxy directly
  if (req.method === "GET") {
    const requestOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
        // Forward user info headers if user is authenticated
        ...(req.user && {
          "x-user-id": req.user.id.toString(),
          "x-user-role": req.user.role,
          "x-user-type": req.user.userType,
        }),
        ...req.headers,
      },
    };

    fetch(targetUrl, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log(`[GATEWAY] Review service response received`);
        res.status(response.status).json(data);
      })
      .catch((error) => {
        console.error(`[GATEWAY] Review service error:`, error);
        res.status(500).json({ error: "Review service error" });
      });
    return;
  }

  // For POST/PUT requests, collect body and forward
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const requestOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        Authorization: req.headers.authorization,
        // Forward user info headers if user is authenticated
        ...(req.user && {
          "x-user-id": req.user.id.toString(),
          "x-user-role": req.user.role,
          "x-user-type": req.user.userType,
        }),
      },
      body: body,
    };

    fetch(targetUrl, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log(`[GATEWAY] Review service response received`);
        res.status(response.status).json(data);
      })
      .catch((error) => {
        console.error(`[GATEWAY] Review service error:`, error);
        res.status(500).json({ error: "Review service error" });
      });
  });
});

// Add route for creating new reviews (POST /api/reviews)
app.all(/^\/api\/reviews/, (req, res) => {
  console.log(
    `[GATEWAY] Review API route matched: ${req.method} ${req.originalUrl}`
  );

  // Proxy to review service
  const reviewServiceUrl = "http://localhost:5005";
  const targetUrl = `${reviewServiceUrl}${req.originalUrl}`;

  console.log(`[GATEWAY] Proxying to: ${targetUrl}`);

  // For GET requests, proxy directly
  if (req.method === "GET") {
    const requestOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
        // Forward user info headers if user is authenticated
        ...(req.user && {
          "x-user-id": req.user.id.toString(),
          "x-user-role": req.user.role,
          "x-user-type": req.user.userType,
        }),
        ...req.headers,
      },
    };

    fetch(targetUrl, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log(`[GATEWAY] Review service response:`, response.status);
        res.status(response.status).json(data);
      })
      .catch((error) => {
        console.error(`[GATEWAY] Review service error:`, error);
        res.status(500).json({ error: "Review service error" });
      });
    return;
  }

  // For POST/PUT requests, collect body and forward
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    console.log(`[GATEWAY] Received body:`, body);

    const requestOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        Authorization: req.headers.authorization,
        // Forward user info headers if user is authenticated
        ...(req.user && {
          "x-user-id": req.user.id.toString(),
          "x-user-role": req.user.role,
          "x-user-type": req.user.userType,
        }),
      },
      body: body,
    };

    fetch(targetUrl, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log(`[GATEWAY] Review service response:`, response.status);
        res.status(response.status).json(data);
      })
      .catch((error) => {
        console.error(`[GATEWAY] Review service error:`, error);
        res.status(500).json({ error: "Review service error" });
      });
  });
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
