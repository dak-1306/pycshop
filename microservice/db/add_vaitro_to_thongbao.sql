-- Script to add VaiTro (role) column to thongbao table
-- This will help distinguish between buyer and seller notifications

USE pycshop;

-- Add VaiTro column to thongbao table
ALTER TABLE `thongbao` 
ADD COLUMN `VaiTro` ENUM('buyer', 'seller', 'both') NOT NULL DEFAULT 'buyer' 
AFTER `Loai`;

-- Update existing notifications based on content patterns
-- Seller notifications (contain keywords like "đơn hàng mới", "khách hàng")
UPDATE `thongbao` 
SET `VaiTro` = 'seller'
WHERE `NoiDung` LIKE '%đơn hàng mới%' 
   OR `NoiDung` LIKE '%khách hàng%'
   OR `NoiDung` LIKE '%Vui lòng xác nhận đơn hàng%';

-- Buyer notifications (contain keywords like "đang chờ xác nhận", "người bán")
UPDATE `thongbao` 
SET `VaiTro` = 'buyer'
WHERE `NoiDung` LIKE '%đang chờ xác nhận từ người bán%'
   OR `NoiDung` LIKE '%đã được xác nhận%'
   OR `NoiDung` LIKE '%đang chuẩn bị hàng%'
   OR `NoiDung` LIKE '%đang vận chuyển%'
   OR `NoiDung` LIKE '%đã giao%';

-- Verify the changes
SELECT 
  ID_ThongBao,
  ID_NguoiNhan,
  VaiTro,
  Loai,
  LEFT(NoiDung, 50) as NoiDung_Preview,
  DaDoc,
  ThoiGianGui
FROM `thongbao`
ORDER BY ThoiGianGui DESC;
