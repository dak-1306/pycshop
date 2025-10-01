import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

const app = express();

// CORS configuration with security - chỉ cho phép specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000", // React dev server
      "http://localhost:5000", // API Gateway
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

console.log("🔒 [AUTH] CORS allowed origins:", allowedOrigins);

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.originalUrl}`);
  console.log("[AUTH] Headers:", JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("[AUTH] Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
app.use("/", authRoutes);

// Port lấy từ .env
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
