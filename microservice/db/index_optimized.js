// OPTIMIZED DATABASE CONNECTION FOR 1M+ USERS
// This replaces the current db/index.js with high-performance configuration

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Parse DB_URL từ .env
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

// OPTIMIZED CONNECTION POOL FOR HIGH TRAFFIC
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 100, // Tăng từ 10 lên 100 cho 1M users
  queueLimit: 1000, // Giới hạn queue để tránh memory leak
  acquireTimeout: 5000, // Giảm từ 60s xuống 5s để fail fast
  timeout: 30000, // Giảm query timeout từ 60s xuống 30s
  idleTimeout: 900000, // 15 phút idle timeout
  reconnect: true, // Enable auto reconnect
  maxReconnects: 10, // Số lần reconnect tối đa
  reconnectDelay: 2000, // Delay giữa các lần reconnect

  // MySQL specific optimizations for high concurrency
  ssl: false, // Disable SSL để tăng performance (nếu internal network)
  multipleStatements: false, // Security: disable multiple statements
  dateStrings: false, // Performance: return dates as Date objects
  supportBigNumbers: true, // Support big numbers
  bigNumberStrings: false, // Return big numbers as numbers, not strings

  // Connection optimization
  typeCast: function (field, next) {
    // Optimize type casting for better performance
    if (field.type === "TINY" && field.length === 1) {
      return field.string() === "1"; // Convert tinyint(1) to boolean
    }
    if (field.type === "DECIMAL") {
      return parseFloat(field.string()); // Convert decimal to float
    }
    return next();
  },
});

// Read replica pool for scaling reads (Master-Slave setup)
let replicaPool = null;

if (process.env.DB_REPLICA_HOST) {
  replicaPool = mysql.createPool({
    ...dbConfig,
    host: process.env.DB_REPLICA_HOST,
    connectionLimit: 150, // More connections for read replica
    queueLimit: 1500,
    acquireTimeout: 3000, // Faster timeout for reads
    timeout: 20000, // Shorter timeout for read queries
    idleTimeout: 600000, // 10 phút idle cho read replica
    reconnect: true,
  });

  console.log("🔄 Read replica pool configured for scaling");
}

// Smart query routing: reads to replica, writes to master
const smartDB = {
  async execute(query, params = []) {
    const queryType = query.trim().toUpperCase();
    const isReadQuery =
      queryType.startsWith("SELECT") ||
      queryType.startsWith("SHOW") ||
      queryType.startsWith("DESCRIBE") ||
      queryType.startsWith("EXPLAIN");

    // Route read queries to replica if available
    if (isReadQuery && replicaPool) {
      try {
        const result = await replicaPool.execute(query, params);
        console.log(
          `📖 [READ-REPLICA] Query executed: ${query.substring(0, 50)}...`
        );
        return result;
      } catch (error) {
        console.warn(
          `⚠️ Read replica failed, falling back to master:`,
          error.message
        );
        // Fallback to master if replica fails
      }
    }

    // Write queries or fallback to master
    const result = await pool.execute(query, params);
    if (!isReadQuery) {
      console.log(
        `✏️ [MASTER] Write query executed: ${query.substring(0, 50)}...`
      );
    }
    return result;
  },

  async getConnection() {
    return await pool.getConnection();
  },

  // Method for explicit read/write routing
  async executeRead(query, params = []) {
    if (replicaPool) {
      return await replicaPool.execute(query, params);
    }
    return await pool.execute(query, params);
  },

  async executeWrite(query, params = []) {
    return await pool.execute(query, params);
  },

  // Connection pool health monitoring
  getPoolStats() {
    return {
      master: {
        totalConnections: pool.pool.config.connectionLimit,
        activeConnections: pool.pool._allConnections.length,
        idleConnections: pool.pool._freeConnections.length,
        queuedRequests: pool.pool._connectionQueue.length,
      },
      replica: replicaPool
        ? {
            totalConnections: replicaPool.pool.config.connectionLimit,
            activeConnections: replicaPool.pool._allConnections.length,
            idleConnections: replicaPool.pool._freeConnections.length,
            queuedRequests: replicaPool.pool._connectionQueue.length,
          }
        : null,
    };
  },
};

// Enhanced connection testing with monitoring
async function testConnection() {
  try {
    // Test master connection
    const masterConnection = await pool.getConnection();
    console.log(
      `✅ Master DB connected: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`
    );
    console.log(
      `🔗 Master pool: ${pool.pool.config.connectionLimit} max connections`
    );
    masterConnection.release();

    // Test replica connection if configured
    if (replicaPool) {
      try {
        const replicaConnection = await replicaPool.getConnection();
        console.log(`✅ Replica DB connected: ${process.env.DB_REPLICA_HOST}`);
        console.log(
          `🔗 Replica pool: ${replicaPool.pool.config.connectionLimit} max connections`
        );
        replicaConnection.release();
      } catch (replicaError) {
        console.warn(`⚠️ Replica connection failed:`, replicaError.message);
        console.warn(`📝 Continuing with master-only setup`);
      }
    }

    // Performance test query
    const start = Date.now();
    await smartDB.execute("SELECT 1 as test");
    const duration = Date.now() - start;
    console.log(`⚡ DB Response time: ${duration}ms`);

    if (duration > 100) {
      console.warn(
        `⚠️ DB response time is high (${duration}ms). Consider optimization.`
      );
    }

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("🔧 Check configuration:");
    console.error(`   - Host: ${dbConfig.host}`);
    console.error(`   - Port: ${dbConfig.port}`);
    console.error(`   - User: ${dbConfig.user}`);
    console.error(`   - Database: ${dbConfig.database}`);
    console.error("   - Ensure MySQL server is running and accessible");
    console.error("   - Check network connectivity and firewall settings");
    return false;
  }
}

// Performance monitoring interval
setInterval(() => {
  const stats = smartDB.getPoolStats();
  console.log(
    `📊 [DB-HEALTH] Master: ${stats.master.activeConnections}/${stats.master.totalConnections} active, ${stats.master.queuedRequests} queued`
  );

  if (stats.replica) {
    console.log(
      `📊 [DB-HEALTH] Replica: ${stats.replica.activeConnections}/${stats.replica.totalConnections} active, ${stats.replica.queuedRequests} queued`
    );
  }

  // Alert if pool utilization is high
  const masterUtilization =
    (stats.master.activeConnections / stats.master.totalConnections) * 100;
  if (masterUtilization > 80) {
    console.warn(
      `🚨 HIGH DB POOL UTILIZATION: ${masterUtilization.toFixed(1)}%`
    );
  }
}, 30000); // Check every 30 seconds

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔄 Gracefully closing database connections...");
  await pool.end();
  if (replicaPool) {
    await replicaPool.end();
  }
  console.log("✅ Database connections closed");
  process.exit(0);
});

// Initialize connection testing
testConnection();

// Export the smart DB interface
export default smartDB;

// Legacy export for backward compatibility
export { smartDB as db };

// Export pool stats for monitoring
export { smartDB };
