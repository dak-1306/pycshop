import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createCacheTables() {
  let connection;
  try {
    console.log("🚀 [CACHE] Setting up cache tables...");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "pycshop",
    });

    console.log("✅ [CACHE] Connected to database");

    // Create product_rating_cache table (without foreign key first)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_rating_cache (
        ID_SanPham INT PRIMARY KEY,
        total_reviews INT DEFAULT 0,
        count_1_star INT DEFAULT 0,
        count_2_star INT DEFAULT 0,
        count_3_star INT DEFAULT 0,
        count_4_star INT DEFAULT 0,
        count_5_star INT DEFAULT 0,
        average_rating DECIMAL(3,1) DEFAULT 0.0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_rating (average_rating),
        INDEX idx_reviews (total_reviews),
        INDEX idx_updated (last_updated)
      )
    `);

    console.log("✅ [CACHE] product_rating_cache table created");

    // Create category_product_count_cache table (without foreign key first)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS category_product_count_cache (
        ID_DanhMuc INT PRIMARY KEY,
        product_count INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_count (product_count),
        INDEX idx_updated (last_updated)
      )
    `);

    console.log("✅ [CACHE] category_product_count_cache table created");

    // Populate product rating cache
    await connection.execute(`
      INSERT IGNORE INTO product_rating_cache (
        ID_SanPham, total_reviews, count_1_star, count_2_star, count_3_star, 
        count_4_star, count_5_star, average_rating
      )
      SELECT 
        p.ID_SanPham,
        COUNT(dg.ID_DanhGia) as total_reviews,
        SUM(CASE WHEN dg.TyLe = 1 THEN 1 ELSE 0 END) as count_1_star,
        SUM(CASE WHEN dg.TyLe = 2 THEN 1 ELSE 0 END) as count_2_star,
        SUM(CASE WHEN dg.TyLe = 3 THEN 1 ELSE 0 END) as count_3_star,
        SUM(CASE WHEN dg.TyLe = 4 THEN 1 ELSE 0 END) as count_4_star,
        SUM(CASE WHEN dg.TyLe = 5 THEN 1 ELSE 0 END) as count_5_star,
        COALESCE(
          ROUND(
            (SUM(CASE WHEN dg.TyLe = 1 THEN 1 ELSE 0 END) * 1 +
             SUM(CASE WHEN dg.TyLe = 2 THEN 1 ELSE 0 END) * 2 +
             SUM(CASE WHEN dg.TyLe = 3 THEN 1 ELSE 0 END) * 3 +
             SUM(CASE WHEN dg.TyLe = 4 THEN 1 ELSE 0 END) * 4 +
             SUM(CASE WHEN dg.TyLe = 5 THEN 1 ELSE 0 END) * 5) /
            NULLIF(COUNT(dg.ID_DanhGia), 0)
          , 1)
        , 0) as average_rating
      FROM SanPham p
      LEFT JOIN DanhGiaSanPham dg ON p.ID_SanPham = dg.ID_SanPham
      GROUP BY p.ID_SanPham
    `);

    // Populate category product count cache
    await connection.execute(`
      INSERT IGNORE INTO category_product_count_cache (ID_DanhMuc, product_count)
      SELECT 
        c.ID_DanhMuc,
        COUNT(DISTINCT p.ID_SanPham) as product_count
      FROM DanhMuc c
      LEFT JOIN SanPham p ON c.ID_DanhMuc = p.ID_DanhMuc AND p.TrangThai != 'inactive'
      GROUP BY c.ID_DanhMuc
    `);

    console.log("✅ [CACHE] Cache data populated successfully!");
    console.log(
      "🚀 [CACHE] Cache tables ready! Restart backend to use CACHE mode"
    );
  } catch (error) {
    console.error("❌ [CACHE] Setup failed:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔄 [CACHE] Database connection closed");
    }
  }
}

createCacheTables();
