import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5010;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `[USER_SERVICE] ${req.method} ${req.path} - ${new Date().toISOString()}`
  );
  next();
});

// Routes
app.use("/api/users", userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "PycShop User Service",
    version: "1.0.0",
    status: "running",
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/users/health",
      profile: "/api/users/profile",
      addresses: "/api/users/addresses",
      defaultAddress: "/api/users/addresses/default",
    },
  });
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const { default: smartDB } = await import("../db/index.js");

    // Test basic query
    const [result] = await smartDB.executeRead("SELECT 1 as test");

    // Test user table
    const [userCount] = await smartDB.executeRead(
      "SELECT COUNT(*) as count FROM nguoidung"
    );

    res.json({
      success: true,
      message: "Database connection successful",
      data: {
        totalUsers: userCount[0].count,
        connection: "OK",
      },
    });
  } catch (error) {
    console.error("[USER_SERVICE] Database test error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    service: "User Service",
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("[USER_SERVICE] Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/users/health`);
  console.log(`🔧 Database test: http://localhost:${PORT}/test-db`);
  console.log(`📋 Service info: http://localhost:${PORT}/`);
});

export default app;
