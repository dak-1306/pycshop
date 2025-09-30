const mysql = require("mysql2/promise");
require("dotenv").config();

// Parse DB_URL từ .env
// Format: mysql://user:password@host:port/database
// Ví dụ: mysql://root@localhost:3306/pycshop
let dbConfig = {};

if (process.env.DB_URL) {
  try {
    const url = new URL(process.env.DB_URL);
    dbConfig = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password || "",
      database: url.pathname.replace("/", ""),
    };
  } catch (error) {
    console.error("Invalid DB_URL format:", error.message);
    process.exit(1);
  }
} else {
  // Fallback nếu không có DB_URL
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pycshop",
  };
}

// Tạo connection pool (loại bỏ reconnect option)
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Test connection khi khởi động
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`Database connected successfully to ${dbConfig.database}`);
    console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Check your database configuration:");
    console.error(`   - Host: ${dbConfig.host}`);
    console.error(`   - Port: ${dbConfig.port}`);
    console.error(`   - User: ${dbConfig.user}`);
    console.error(`   - Database: ${dbConfig.database}`);
    console.error("   - Make sure MySQL server is running");
    return false;
  }
}

// Chạy test khi import module này
testConnection();

module.exports = pool;
