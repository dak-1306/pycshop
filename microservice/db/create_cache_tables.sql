-- ========================================
-- PERFORMANCE OPTIMIZATION SCRIPT
-- Create cache tables for better performance
-- Run this script AFTER the basic system is working
-- ========================================

USE pycshop;

-- Create product rating cache table
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
    FOREIGN KEY (ID_SanPham) REFERENCES SanPham(ID_SanPham) ON DELETE CASCADE,
    INDEX idx_rating (average_rating),
    INDEX idx_reviews (total_reviews),
    INDEX idx_updated (last_updated)
);

-- Create category product count cache table
CREATE TABLE IF NOT EXISTS category_product_count_cache (
    ID_DanhMuc INT PRIMARY KEY,
    product_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_DanhMuc) REFERENCES DanhMuc(ID_DanhMuc) ON DELETE CASCADE,
    INDEX idx_count (product_count),
    INDEX idx_updated (last_updated)
);

-- Populate product rating cache
INSERT INTO product_rating_cache (
    ID_SanPham, 
    total_reviews, 
    count_1_star, 
    count_2_star, 
    count_3_star, 
    count_4_star, 
    count_5_star, 
    average_rating
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
ON DUPLICATE KEY UPDATE
    total_reviews = VALUES(total_reviews),
    count_1_star = VALUES(count_1_star),
    count_2_star = VALUES(count_2_star),
    count_3_star = VALUES(count_3_star),
    count_4_star = VALUES(count_4_star),
    count_5_star = VALUES(count_5_star),
    average_rating = VALUES(average_rating),
    last_updated = CURRENT_TIMESTAMP;

-- Populate category product count cache
INSERT INTO category_product_count_cache (ID_DanhMuc, product_count)
SELECT 
    c.ID_DanhMuc,
    COUNT(DISTINCT p.ID_SanPham) as product_count
FROM DanhMuc c
LEFT JOIN SanPham p ON c.ID_DanhMuc = p.ID_DanhMuc AND p.TrangThai != 'inactive'
GROUP BY c.ID_DanhMuc
ON DUPLICATE KEY UPDATE
    product_count = VALUES(product_count),
    last_updated = CURRENT_TIMESTAMP;

-- Create triggers to auto-update rating cache when reviews change
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS update_rating_cache_after_review_insert
AFTER INSERT ON DanhGiaSanPham
FOR EACH ROW
BEGIN
    INSERT INTO product_rating_cache (
        ID_SanPham, 
        total_reviews, 
        count_1_star, 
        count_2_star, 
        count_3_star, 
        count_4_star, 
        count_5_star, 
        average_rating
    )
    SELECT 
        NEW.ID_SanPham,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) as count_1_star,
        SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) as count_2_star,
        SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) as count_3_star,
        SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) as count_4_star,
        SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) as count_5_star,
        COALESCE(
            ROUND(
                (SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) * 1 +
                 SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) * 2 +
                 SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) * 3 +
                 SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) * 4 +
                 SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) * 5) /
                NULLIF(COUNT(*), 0)
            , 1)
        , 0) as average_rating
    FROM DanhGiaSanPham
    WHERE ID_SanPham = NEW.ID_SanPham
    ON DUPLICATE KEY UPDATE
        total_reviews = VALUES(total_reviews),
        count_1_star = VALUES(count_1_star),
        count_2_star = VALUES(count_2_star),
        count_3_star = VALUES(count_3_star),
        count_4_star = VALUES(count_4_star),
        count_5_star = VALUES(count_5_star),
        average_rating = VALUES(average_rating),
        last_updated = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS update_rating_cache_after_review_update
AFTER UPDATE ON DanhGiaSanPham
FOR EACH ROW
BEGIN
    INSERT INTO product_rating_cache (
        ID_SanPham, 
        total_reviews, 
        count_1_star, 
        count_2_star, 
        count_3_star, 
        count_4_star, 
        count_5_star, 
        average_rating
    )
    SELECT 
        NEW.ID_SanPham,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) as count_1_star,
        SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) as count_2_star,
        SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) as count_3_star,
        SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) as count_4_star,
        SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) as count_5_star,
        COALESCE(
            ROUND(
                (SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) * 1 +
                 SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) * 2 +
                 SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) * 3 +
                 SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) * 4 +
                 SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) * 5) /
                NULLIF(COUNT(*), 0)
            , 1)
        , 0) as average_rating
    FROM DanhGiaSanPham
    WHERE ID_SanPham = NEW.ID_SanPham
    ON DUPLICATE KEY UPDATE
        total_reviews = VALUES(total_reviews),
        count_1_star = VALUES(count_1_star),
        count_2_star = VALUES(count_2_star),
        count_3_star = VALUES(count_3_star),
        count_4_star = VALUES(count_4_star),
        count_5_star = VALUES(count_5_star),
        average_rating = VALUES(average_rating),
        last_updated = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS update_rating_cache_after_review_delete
AFTER DELETE ON DanhGiaSanPham
FOR EACH ROW
BEGIN
    INSERT INTO product_rating_cache (
        ID_SanPham, 
        total_reviews, 
        count_1_star, 
        count_2_star, 
        count_3_star, 
        count_4_star, 
        count_5_star, 
        average_rating
    )
    SELECT 
        OLD.ID_SanPham,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) as count_1_star,
        SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) as count_2_star,
        SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) as count_3_star,
        SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) as count_4_star,
        SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) as count_5_star,
        COALESCE(
            ROUND(
                (SUM(CASE WHEN TyLe = 1 THEN 1 ELSE 0 END) * 1 +
                 SUM(CASE WHEN TyLe = 2 THEN 1 ELSE 0 END) * 2 +
                 SUM(CASE WHEN TyLe = 3 THEN 1 ELSE 0 END) * 3 +
                 SUM(CASE WHEN TyLe = 4 THEN 1 ELSE 0 END) * 4 +
                 SUM(CASE WHEN TyLe = 5 THEN 1 ELSE 0 END) * 5) /
                NULLIF(COUNT(*), 0)
            , 1)
        , 0) as average_rating
    FROM DanhGiaSanPham
    WHERE ID_SanPham = OLD.ID_SanPham
    ON DUPLICATE KEY UPDATE
        total_reviews = VALUES(total_reviews),
        count_1_star = VALUES(count_1_star),
        count_2_star = VALUES(count_2_star),
        count_3_star = VALUES(count_3_star),
        count_4_star = VALUES(count_4_star),
        count_5_star = VALUES(count_5_star),
        average_rating = VALUES(average_rating),
        last_updated = CURRENT_TIMESTAMP;
END$$

-- Create trigger to update category count cache when products change
CREATE TRIGGER IF NOT EXISTS update_category_cache_after_product_insert
AFTER INSERT ON SanPham
FOR EACH ROW
BEGIN
    INSERT INTO category_product_count_cache (ID_DanhMuc, product_count)
    SELECT 
        NEW.ID_DanhMuc,
        COUNT(DISTINCT ID_SanPham) as product_count
    FROM SanPham
    WHERE ID_DanhMuc = NEW.ID_DanhMuc AND TrangThai != 'inactive'
    ON DUPLICATE KEY UPDATE
        product_count = VALUES(product_count),
        last_updated = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER IF NOT EXISTS update_category_cache_after_product_update
AFTER UPDATE ON SanPham
FOR EACH ROW
BEGIN
    -- Update old category count
    IF OLD.ID_DanhMuc IS NOT NULL THEN
        INSERT INTO category_product_count_cache (ID_DanhMuc, product_count)
        SELECT 
            OLD.ID_DanhMuc,
            COUNT(DISTINCT ID_SanPham) as product_count
        FROM SanPham
        WHERE ID_DanhMuc = OLD.ID_DanhMuc AND TrangThai != 'inactive'
        ON DUPLICATE KEY UPDATE
            product_count = VALUES(product_count),
            last_updated = CURRENT_TIMESTAMP;
    END IF;
    
    -- Update new category count
    IF NEW.ID_DanhMuc IS NOT NULL THEN
        INSERT INTO category_product_count_cache (ID_DanhMuc, product_count)
        SELECT 
            NEW.ID_DanhMuc,
            COUNT(DISTINCT ID_SanPham) as product_count
        FROM SanPham
        WHERE ID_DanhMuc = NEW.ID_DanhMuc AND TrangThai != 'inactive'
        ON DUPLICATE KEY UPDATE
            product_count = VALUES(product_count),
            last_updated = CURRENT_TIMESTAMP;
    END IF;
END$$

CREATE TRIGGER IF NOT EXISTS update_category_cache_after_product_delete
AFTER DELETE ON SanPham
FOR EACH ROW
BEGIN
    INSERT INTO category_product_count_cache (ID_DanhMuc, product_count)
    SELECT 
        OLD.ID_DanhMuc,
        COUNT(DISTINCT ID_SanPham) as product_count
    FROM SanPham
    WHERE ID_DanhMuc = OLD.ID_DanhMuc AND TrangThai != 'inactive'
    ON DUPLICATE KEY UPDATE
        product_count = VALUES(product_count),
        last_updated = CURRENT_TIMESTAMP;
END$$

DELIMITER ;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_sanpham_danhmuc_trangthai ON SanPham(ID_DanhMuc, TrangThai);
CREATE INDEX IF NOT EXISTS idx_sanpham_tensanpham ON SanPham(TenSanPham);
CREATE INDEX IF NOT EXISTS idx_sanpham_gia ON SanPham(Gia);
CREATE INDEX IF NOT EXISTS idx_sanpham_capnhat ON SanPham(CapNhat);
CREATE INDEX IF NOT EXISTS idx_sanpham_tonkho ON SanPham(TonKho);
CREATE INDEX IF NOT EXISTS idx_danhgia_sanpham ON DanhGiaSanPham(ID_SanPham);
CREATE INDEX IF NOT EXISTS idx_danhgia_tyle ON DanhGiaSanPham(TyLe);
CREATE INDEX IF NOT EXISTS idx_danhgia_thoigian ON DanhGiaSanPham(ThoiGian);
CREATE INDEX IF NOT EXISTS idx_anhsanpham_sanpham ON AnhSanPham(ID_SanPham);
CREATE INDEX IF NOT EXISTS idx_cuahang_diachi ON CuaHang(DiaChiCH);

-- Success message
SELECT 'Cache tables created successfully! Performance optimization complete.' as Result;
