-- Tạo bảng Seller với thông tin đơn giản
CREATE TABLE Seller (
    ID_Seller INT AUTO_INCREMENT PRIMARY KEY,
    ID_NguoiDung INT NOT NULL,
    TenShop VARCHAR(255) NOT NULL,
    MoTaShop TEXT,
    DanhMucShop VARCHAR(100),
    DiaChiShop TEXT NOT NULL,
    SoDienThoaiShop VARCHAR(15) NOT NULL,
    TrangThai ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key reference
    FOREIGN KEY (ID_NguoiDung) REFERENCES NguoiDung(ID_NguoiDung) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_user_id (ID_NguoiDung),
    INDEX idx_shop_category (DanhMucShop),
    INDEX idx_shop_status (TrangThai)
);

-- Thêm constraint để đảm bảo mỗi user chỉ có thể tạo một shop
ALTER TABLE Seller ADD CONSTRAINT unique_user_seller UNIQUE (ID_NguoiDung);

-- Insert sample data (optional)
-- INSERT INTO Seller (ID_NguoiDung, TenShop, MoTaShop, DanhMucShop, DiaChiShop, SoDienThoaiShop) 
-- VALUES 
-- (1, 'Shop Thời Trang ABC', 'Chuyên bán quần áo thời trang nam nữ chất lượng cao', 'Thời trang nam', '123 Nguyễn Văn A, Quận 1, TP.HCM', '0901234567'),
-- (2, 'Tech Store XYZ', 'Cửa hàng điện tử và phụ kiện công nghệ', 'Điện thoại & phụ kiện', '456 Trần Hưng Đạo, Quận 5, TP.HCM', '0987654321');