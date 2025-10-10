import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import danhGiaRoutes from "./routes/danhGiaRoutes.js";
import kafkaService from "./services/kafkaService.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", danhGiaRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Review Service is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error in Review Service:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Initialize Kafka and start server
const startServer = async () => {
  try {
    // Initialize Kafka (don't fail if Kafka is not available)
    await kafkaService.initialize();

    app.listen(PORT, () => {
      console.log(`Review Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
