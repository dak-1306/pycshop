require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
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
