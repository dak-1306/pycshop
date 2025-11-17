import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pycshop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

// Test connection
pool
  .getConnection()
  .then((connection) => {
    console.log("[ORDER_DB] Connected to MySQL database");
    connection.release();
  })
  .catch((error) => {
    console.error("[ORDER_DB] Error connecting to database:", error);
  });

export { pool };
