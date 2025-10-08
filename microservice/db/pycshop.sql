-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 08, 2025 lúc 04:52 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `pycshop`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `ID_NguoiDung` int(11) NOT NULL,
  `HoTen` varchar(200) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MatKhau` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`ID_NguoiDung`, `HoTen`, `Email`, `MatKhau`) VALUES
(1, 'Trần Tấn Đạt', 'dat@gmail.com', '$2b$10$1Jqo6RHj7Sm/E1zQTBx2HO7o4vBhFjrJY78bArp/lSGo8D.1e1f.y');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `anhsanpham`
--

CREATE TABLE `anhsanpham` (
  `ID_Anh` bigint(20) NOT NULL,
  `ID_SanPham` bigint(20) NOT NULL,
  `Url` text NOT NULL,
  `Upload_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `anhsanpham`
--

INSERT INTO `anhsanpham` (`ID_Anh`, `ID_SanPham`, `Url`, `Upload_at`) VALUES
(12, 29, '/uploads/product_images/product_29_1759660782333_shq9rh2vr.png', '2025-10-05 10:39:42'),
(14, 33, '/uploads/product_images/product_33_1759934234970_81ypmyi0u.jpg', '2025-10-08 14:37:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `apma`
--

CREATE TABLE `apma` (
  `ID_ApMa` bigint(20) NOT NULL,
  `ID_Phieu` bigint(20) NOT NULL,
  `ID_NguoiDung` bigint(20) NOT NULL,
  `ID_DonHang` bigint(20) NOT NULL,
  `SuDungLuc` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baocao`
--

CREATE TABLE `baocao` (
  `ID_BaoCao` bigint(20) NOT NULL,
  `ID_NguoiBC` bigint(20) NOT NULL,
  `ID_NguoiBiBC` bigint(20) DEFAULT NULL,
  `ID_SpBiBC` bigint(20) DEFAULT NULL,
  `LoaiBaoCao` enum('User','Product') NOT NULL,
  `LiDo` text NOT NULL,
  `TrangThai` enum('in_progress','resolved') NOT NULL DEFAULT 'in_progress',
  `ThoiGianTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category_product_count_cache`
--

CREATE TABLE `category_product_count_cache` (
  `ID_DanhMuc` int(11) NOT NULL,
  `product_count` int(11) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category_product_count_cache`
--

INSERT INTO `category_product_count_cache` (`ID_DanhMuc`, `product_count`, `last_updated`) VALUES
(1, 2, '2025-10-08 12:03:56'),
(2, 2, '2025-10-08 12:03:56'),
(3, 2, '2025-10-08 12:03:56'),
(4, 2, '2025-10-08 12:03:56'),
(5, 2, '2025-10-08 12:03:56'),
(6, 1, '2025-10-08 12:03:56'),
(7, 1, '2025-10-08 12:03:56'),
(8, 1, '2025-10-08 12:03:56'),
(9, 1, '2025-10-08 12:03:56'),
(10, 1, '2025-10-08 12:03:56'),
(11, 1, '2025-10-08 12:03:56'),
(12, 1, '2025-10-08 12:03:56'),
(13, 1, '2025-10-08 12:03:56'),
(14, 1, '2025-10-08 12:03:56'),
(15, 1, '2025-10-08 12:03:56'),
(16, 1, '2025-10-08 12:03:56'),
(17, 1, '2025-10-08 12:03:56'),
(18, 7, '2025-10-08 12:03:56'),
(19, 1, '2025-10-08 12:03:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdonhang`
--

CREATE TABLE `chitietdonhang` (
  `ID_ChiTietDH` bigint(20) NOT NULL,
  `ID_DonHang` bigint(20) NOT NULL,
  `ID_SanPham` bigint(20) NOT NULL,
  `DonGia` decimal(12,2) NOT NULL CHECK (`DonGia` >= 0),
  `SoLuong` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuahang`
--

CREATE TABLE `cuahang` (
  `ID_CuaHang` bigint(20) NOT NULL,
  `TenCuaHang` varchar(255) NOT NULL,
  `DanhGiaTB` decimal(2,1) UNSIGNED NOT NULL DEFAULT 0.0 CHECK (`DanhGiaTB` >= 0.0 and `DanhGiaTB` <= 5.0),
  `ID_DanhMuc` int(11) NOT NULL,
  `DiaChiCH` varchar(255) NOT NULL,
  `SoDienThoaiCH` varchar(20) NOT NULL,
  `NgayCapNhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cuahang`
--

INSERT INTO `cuahang` (`ID_CuaHang`, `TenCuaHang`, `DanhGiaTB`, `ID_DanhMuc`, `DiaChiCH`, `SoDienThoaiCH`, `NgayCapNhat`) VALUES
(1, 'Thời Trang Nam Unisex', 0.0, 1, '123 Lê Lợi, Quận 1, TP.HCM', '0901234567', '2025-10-02 20:30:56'),
(3, 'Cửa hàng sách Hải Nam', 0.0, 18, '741 Võ Văn Ngân, Phường Linh Chiểu, TP.Thủ Đức, TP.HCM', '0192478948', '2025-10-02 23:29:55'),
(7, 'Shop của Bảnh', 0.0, 11, '741 Võ Văn Ngân, Phường Linh Chiểu, TP.Thủ Đức, TP.HCM', '0192478948', '2025-10-06 15:43:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhgiasanpham`
--

CREATE TABLE `danhgiasanpham` (
  `ID_DanhGia` bigint(20) NOT NULL,
  `ID_SanPham` bigint(20) NOT NULL,
  `ID_NguoiMua` bigint(20) NOT NULL,
  `BinhLuan` text DEFAULT NULL,
  `TyLe` int(11) NOT NULL,
  `ThoiGian` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhgiasanpham`
--

INSERT INTO `danhgiasanpham` (`ID_DanhGia`, `ID_SanPham`, `ID_NguoiMua`, `BinhLuan`, `TyLe`, `ThoiGian`) VALUES
(1, 1, 3, 'Áo đẹp, vải mát và dễ mặc.', 5, '2025-10-08 10:22:51'),
(2, 1, 4, 'Giao hàng nhanh, chất lượng ổn.', 4, '2025-10-08 10:22:51'),
(3, 1, 5, 'Mặc hơi rộng, nhưng chất liệu tốt.', 4, '2025-10-08 10:22:51'),
(4, 1, 6, 'Không giống hình lắm nhưng vẫn ổn.', 3, '2025-10-08 10:22:51'),
(5, 2, 3, 'Đầm rất xinh, vải mềm mịn.', 5, '2025-10-08 10:22:51'),
(6, 2, 4, 'Form hơi nhỏ, nên chọn size lớn hơn.', 4, '2025-10-08 10:22:51'),
(7, 2, 5, 'Đẹp nhưng giao hơi lâu.', 3, '2025-10-08 10:22:51'),
(8, 2, 6, 'Sản phẩm tốt, sẽ mua thêm.', 5, '2025-10-08 10:22:51'),
(9, 3, 3, 'Ốp chắc chắn, cầm tay rất vừa.', 5, '2025-10-08 10:22:51'),
(10, 3, 4, 'Màu không giống hình lắm.', 3, '2025-10-08 10:22:51'),
(11, 3, 5, 'Giá ổn, chất lượng tốt.', 4, '2025-10-08 10:22:51'),
(12, 3, 6, 'Ốp bị trầy nhẹ khi nhận.', 2, '2025-10-08 10:22:51'),
(13, 4, 3, 'Máy chạy ổn, cấu hình phù hợp nhu cầu.', 5, '2025-10-08 10:22:51'),
(14, 4, 4, 'Pin yếu, dùng tầm 3 tiếng.', 3, '2025-10-08 10:22:51'),
(15, 4, 5, 'Thiết kế đẹp, màn hình nét.', 4, '2025-10-08 10:22:51'),
(16, 4, 6, 'Giao hàng cẩn thận, có tem chính hãng.', 5, '2025-10-08 10:22:51'),
(17, 5, 3, 'Quay rõ, màu đẹp, dễ dùng.', 5, '2025-10-08 10:22:51'),
(18, 5, 4, 'Ổn so với giá, nhưng pin hơi yếu.', 4, '2025-10-08 10:22:51'),
(19, 5, 5, 'Sản phẩm đúng mô tả.', 4, '2025-10-08 10:22:51'),
(20, 5, 6, 'Giao hàng nhanh, rất hài lòng.', 5, '2025-10-08 10:22:51'),
(21, 6, 3, 'Đẹp, nhẹ, chính hãng Casio.', 5, '2025-10-08 10:22:51'),
(22, 6, 4, 'Dây đeo hơi cứng.', 3, '2025-10-08 10:22:51'),
(23, 6, 5, 'Thiết kế sang trọng, dễ xem giờ.', 5, '2025-10-08 10:22:51'),
(24, 6, 6, 'Chống nước tốt.', 4, '2025-10-08 10:22:51'),
(25, 7, 3, 'Giày đẹp, đúng size.', 5, '2025-10-08 10:22:51'),
(26, 7, 4, 'Mang êm, không bị trượt.', 4, '2025-10-08 10:22:51'),
(27, 7, 5, 'Giao hàng nhanh, đóng gói kỹ.', 5, '2025-10-08 10:22:51'),
(28, 7, 6, 'Đế hơi cứng.', 3, '2025-10-08 10:22:51'),
(29, 8, 3, 'Giày vừa chân, kiểu dáng đẹp.', 5, '2025-10-08 10:22:51'),
(30, 8, 4, 'Mang hơi đau chân lúc đầu.', 3, '2025-10-08 10:22:51'),
(31, 8, 5, 'Giày ổn, màu nhã nhặn.', 4, '2025-10-08 10:22:51'),
(32, 8, 6, 'Sản phẩm đẹp, giống mô tả.', 5, '2025-10-08 10:22:51'),
(33, 9, 3, 'Túi chắc chắn, đựng được nhiều.', 5, '2025-10-08 10:22:51'),
(34, 9, 4, 'Khóa kéo hơi cứng.', 3, '2025-10-08 10:22:51'),
(35, 9, 5, 'Thiết kế đẹp, rất hài lòng.', 5, '2025-10-08 10:22:51'),
(36, 9, 6, 'Giá hợp lý, chất liệu tốt.', 4, '2025-10-08 10:22:51'),
(37, 10, 3, 'Túi rất đẹp, giống hình.', 5, '2025-10-08 10:22:51'),
(38, 10, 4, 'Chất da mềm, đường may chắc.', 5, '2025-10-08 10:22:51'),
(39, 10, 5, 'Giao hàng nhanh, đóng gói đẹp.', 5, '2025-10-08 10:22:51'),
(40, 10, 6, 'Kích thước nhỏ hơn mong đợi.', 3, '2025-10-08 10:22:51'),
(41, 11, 3, 'Âm thanh tốt, pin ổn.', 5, '2025-10-08 10:22:51'),
(42, 11, 4, 'Bluetooth kết nối nhanh.', 4, '2025-10-08 10:22:51'),
(43, 11, 5, 'Hơi đau tai nếu đeo lâu.', 3, '2025-10-08 10:22:51'),
(44, 11, 6, 'Giá hợp lý, chất lượng ổn.', 4, '2025-10-08 10:22:51'),
(45, 12, 3, 'Chạy êm, tiết kiệm điện.', 5, '2025-10-08 10:22:51'),
(46, 12, 4, 'Thiết kế đẹp, dễ sử dụng.', 5, '2025-10-08 10:22:51'),
(47, 12, 5, 'Pin hơi yếu.', 3, '2025-10-08 10:22:51'),
(48, 12, 6, 'Giá cao nhưng đáng tiền.', 4, '2025-10-08 10:22:51'),
(49, 13, 3, 'Chắc chắn, gỗ tốt.', 5, '2025-10-08 10:22:51'),
(50, 13, 4, 'Màu đẹp, đúng mô tả.', 5, '2025-10-08 10:22:51'),
(51, 13, 5, 'Giao hàng lâu.', 3, '2025-10-08 10:22:51'),
(52, 13, 6, 'Lắp ráp dễ dàng.', 4, '2025-10-08 10:22:51'),
(53, 14, 3, 'Màu lên đẹp, giữ lâu.', 5, '2025-10-08 10:22:51'),
(54, 14, 4, 'Không bị khô môi.', 4, '2025-10-08 10:22:51'),
(55, 14, 5, 'Giá hợp lý.', 4, '2025-10-08 10:22:51'),
(56, 14, 6, 'Mùi thơm nhẹ, dễ chịu.', 5, '2025-10-08 10:22:51'),
(57, 15, 3, 'Dễ uống, hiệu quả tốt.', 5, '2025-10-08 10:22:51'),
(58, 15, 4, 'Giá phải chăng.', 4, '2025-10-08 10:22:51'),
(59, 15, 5, 'Bao bì đẹp.', 4, '2025-10-08 10:22:51'),
(60, 15, 6, 'Sẽ mua lại.', 5, '2025-10-08 10:22:51'),
(61, 16, 3, 'Đỉnh cao giải trí, đồ họa siêu đẹp.', 5, '2025-10-08 10:22:51'),
(62, 16, 4, 'Giá hơi cao.', 4, '2025-10-08 10:22:51'),
(63, 16, 5, 'Chạy êm, chơi mượt.', 5, '2025-10-08 10:22:51'),
(64, 16, 6, 'Giao hàng nhanh, đóng gói kỹ.', 5, '2025-10-08 10:22:51'),
(65, 17, 3, 'Bé uống ngon, tăng cân tốt.', 5, '2025-10-08 10:22:51'),
(66, 17, 4, 'Giá hơi cao.', 4, '2025-10-08 10:22:51'),
(67, 17, 5, 'Chất lượng tốt, chính hãng.', 5, '2025-10-08 10:22:51'),
(68, 17, 6, 'Sẽ mua thêm.', 5, '2025-10-08 10:22:51'),
(69, 18, 3, 'Sách mới, giấy tốt.', 5, '2025-10-08 10:22:51'),
(70, 18, 4, 'Đúng chương trình học.', 5, '2025-10-08 10:22:51'),
(71, 18, 5, 'Giá hợp lý.', 4, '2025-10-08 10:22:51'),
(72, 18, 6, 'Giao hàng nhanh.', 5, '2025-10-08 10:22:51'),
(73, 19, 3, 'Mì ngon, vị đậm đà.', 5, '2025-10-08 10:22:51'),
(74, 19, 4, 'Giao nhanh, còn hạn sử dụng dài.', 5, '2025-10-08 10:22:51'),
(75, 19, 5, 'Giá ổn.', 4, '2025-10-08 10:22:51'),
(76, 19, 6, 'Hàng chính hãng.', 5, '2025-10-08 10:22:51'),
(77, 20, 3, 'Áo mềm, thấm hút tốt.', 5, '2025-10-08 10:22:51'),
(78, 20, 4, 'Vải co giãn, dễ mặc.', 4, '2025-10-08 10:22:51'),
(79, 20, 5, 'Màu không phai sau khi giặt.', 5, '2025-10-08 10:22:51'),
(80, 20, 6, 'Sản phẩm ổn trong tầm giá.', 4, '2025-10-08 10:22:51'),
(81, 21, 3, 'Áo đẹp, đúng size.', 5, '2025-10-08 10:22:51'),
(82, 21, 4, 'Chất vải mịn, dễ ủi.', 4, '2025-10-08 10:22:51'),
(83, 21, 5, 'Đường may chắc chắn.', 5, '2025-10-08 10:22:51'),
(84, 21, 6, 'Rất đáng tiền.', 5, '2025-10-08 10:22:51'),
(85, 22, 3, 'Máy mượt, camera đẹp.', 5, '2025-10-08 10:22:51'),
(86, 22, 4, 'Pin ổn, màn hình sắc nét.', 5, '2025-10-08 10:22:51'),
(87, 22, 5, 'Giá cao nhưng đáng tiền.', 4, '2025-10-08 10:22:51'),
(88, 22, 6, 'Sản phẩm chính hãng.', 5, '2025-10-08 10:22:51'),
(89, 23, 3, 'Cấu hình mạnh, pin lâu.', 5, '2025-10-08 10:22:51'),
(90, 23, 4, 'Thiết kế đẹp.', 5, '2025-10-08 10:22:51'),
(91, 23, 5, 'Giá hơi cao.', 4, '2025-10-08 10:22:51'),
(92, 23, 6, 'Màn hình sắc nét.', 5, '2025-10-08 10:22:51'),
(93, 24, 3, 'Chụp nét, màu đẹp.', 5, '2025-10-08 10:22:51'),
(94, 24, 4, 'Dễ dùng, phù hợp người mới.', 4, '2025-10-08 10:22:51'),
(95, 24, 5, 'Pin yếu.', 3, '2025-10-08 10:22:51'),
(96, 24, 6, 'Giá hợp lý.', 4, '2025-10-08 10:22:51'),
(97, 25, 3, 'Truyện rất hấp dẫn.', 5, '2025-10-08 10:22:51'),
(98, 25, 4, 'Cốt truyện hay, cuốn hút.', 5, '2025-10-08 10:22:51'),
(99, 25, 5, 'Giấy in tốt.', 4, '2025-10-08 10:22:51'),
(100, 25, 6, 'Đáng đọc.', 5, '2025-10-08 10:22:51'),
(101, 26, 3, 'Nội dung lôi cuốn.', 5, '2025-10-08 10:22:51'),
(102, 26, 4, 'Hơi ngắn nhưng hay.', 4, '2025-10-08 10:22:51'),
(103, 26, 5, 'Bìa đẹp.', 4, '2025-10-08 10:22:51'),
(104, 26, 6, 'Giá tốt.', 5, '2025-10-08 10:22:51'),
(105, 29, 3, 'Thông tin bổ ích, dễ hiểu.', 5, '2025-10-08 10:22:51'),
(106, 29, 4, 'Sách hiếm, đáng mua.', 5, '2025-10-08 10:22:51'),
(107, 29, 5, 'Giấy đẹp, in rõ.', 4, '2025-10-08 10:22:51'),
(108, 29, 6, 'Nội dung chuyên sâu.', 5, '2025-10-08 10:22:51'),
(109, 30, 3, 'Truyền cảm hứng tốt.', 5, '2025-10-08 10:22:51'),
(110, 30, 4, 'Nhiều bài học hữu ích.', 5, '2025-10-08 10:22:51'),
(111, 30, 5, 'Sách hay, dễ đọc.', 5, '2025-10-08 10:22:51'),
(112, 30, 6, 'Đọc xong có động lực.', 5, '2025-10-08 10:22:51'),
(113, 31, 3, 'Truyện hay cho thiếu nhi.', 5, '2025-10-08 10:22:51'),
(114, 31, 4, 'In màu đẹp.', 5, '2025-10-08 10:22:51'),
(115, 31, 5, 'Giấy tốt, đóng gáy chắc.', 4, '2025-10-08 10:22:51'),
(116, 31, 6, 'Phù hợp cho trẻ nhỏ.', 5, '2025-10-08 10:22:51'),
(117, 32, 3, 'Sách chuẩn chương trình.', 5, '2025-10-08 10:22:51'),
(118, 32, 4, 'Giấy trắng, dễ đọc.', 5, '2025-10-08 10:22:51'),
(119, 32, 5, 'Giá hợp lý.', 4, '2025-10-08 10:22:51'),
(120, 32, 6, 'Giao nhanh, đóng gói kỹ.', 5, '2025-10-08 10:22:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

CREATE TABLE `danhmuc` (
  `ID_DanhMuc` int(11) NOT NULL,
  `TenDanhMuc` varchar(150) NOT NULL,
  `MoTa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`ID_DanhMuc`, `TenDanhMuc`, `MoTa`) VALUES
(1, 'Thời Trang Nam', 'Danh mục các sản phẩm thời trang dành cho nam'),
(2, 'Thời Trang Nữ', 'Danh mục các sản phẩm thời trang dành cho nữ'),
(3, 'Điện Thoại & Phụ Kiện', 'Danh mục điện thoại di động và phụ kiện đi kèm'),
(4, 'Máy Tính & Laptop', 'Danh mục các loại máy tính để bàn và laptop'),
(5, 'Máy Ảnh & Máy Quay Phim', 'Danh mục máy ảnh kỹ thuật số và máy quay phim'),
(6, 'Đồng Hồ', 'Danh mục đồng hồ thời trang và đồng hồ thông minh'),
(7, 'Giày Dép Nam', 'Danh mục giày dép dành cho nam giới'),
(8, 'Giày Dép Nữ', 'Danh mục giày dép dành cho nữ giới'),
(9, 'Túi Ví Nam', 'Danh mục túi xách, ví dành cho nam'),
(10, 'Túi Ví Nữ', 'Danh mục túi xách, ví dành cho nữ'),
(11, 'Thiết Bị Điện Tử', 'Danh mục các thiết bị điện tử khác'),
(12, 'Ô Tô & Xe Máy & Xe Đạp', 'Danh mục phương tiện di chuyển: ô tô, xe máy, xe đạp'),
(13, 'Nhà Cửa & Đời Sống', 'Danh mục đồ dùng cho nhà cửa và đời sống hằng ngày'),
(14, 'Sắc Đẹp', 'Danh mục các sản phẩm làm đẹp và chăm sóc cá nhân'),
(15, 'Sức Khỏe', 'Danh mục các sản phẩm chăm sóc sức khỏe'),
(16, 'Giải Trí & Sở Thích', 'Danh mục đồ chơi, game, sản phẩm giải trí và sở thích'),
(17, 'Mẹ & Bé', 'Danh mục các sản phẩm dành cho mẹ và bé'),
(18, 'Nhà Sách Online', 'Danh mục sách, truyện, văn phòng phẩm'),
(19, 'Bách Hóa Online', 'Danh mục các sản phẩm tiêu dùng hằng ngày');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

CREATE TABLE `donhang` (
  `ID_DonHang` bigint(20) NOT NULL,
  `ID_NguoiMua` bigint(20) NOT NULL,
  `TongGia` decimal(12,2) NOT NULL CHECK (`TongGia` >= 0),
  `ThoiGianTao` timestamp NOT NULL DEFAULT current_timestamp(),
  `TrangThai` enum('pending','confirmed','shipped','cancelled') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giaohang`
--

CREATE TABLE `giaohang` (
  `ID_GiaoHang` bigint(20) NOT NULL,
  `ID_DonHang` bigint(20) NOT NULL,
  `DiaChi` text NOT NULL,
  `TrangThai` enum('undelivery','out_for_delivery','delivered') DEFAULT NULL,
  `NgayVanChuyen` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `NgayGiaoToi` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giohang`
--

CREATE TABLE `giohang` (
  `ID_GioHang` bigint(20) NOT NULL,
  `ID_NguoiMua` bigint(20) NOT NULL,
  `ThoiGianTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoithoai`
--

CREATE TABLE `hoithoai` (
  `ID_HoiThoai` bigint(20) NOT NULL,
  `ID_NguoiBan` bigint(20) NOT NULL,
  `ID_NguoiMua` bigint(20) NOT NULL,
  `ThoiGianTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `ID_NguoiDung` bigint(20) NOT NULL,
  `VaiTro` enum('seller','buyer') NOT NULL DEFAULT 'buyer',
  `HoTen` varchar(200) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `SoDienThoai` varchar(50) DEFAULT NULL,
  `DiaChi` text DEFAULT NULL,
  `TrangThai` enum('active','block') NOT NULL DEFAULT 'active',
  `ThoiGianTao` timestamp NOT NULL DEFAULT current_timestamp(),
  `AvatarUrl` varchar(500) DEFAULT NULL,
  `ID_CuaHang` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`ID_NguoiDung`, `VaiTro`, `HoTen`, `Email`, `MatKhau`, `SoDienThoai`, `DiaChi`, `TrangThai`, `ThoiGianTao`, `AvatarUrl`, `ID_CuaHang`) VALUES
(3, 'seller', 'Nguyễn Văn Test', 'test@gmail.com', '$2b$10$kyTNrvfNiY2YcWIsctNm8O6Z08YJVJRNdIwNmgjlgGANAq7kNjrjm', '0123456789', '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'active', '2025-09-29 10:46:02', NULL, 3),
(4, 'seller', 'Trần Tuấn Anh', 'anh@gmail.com', '$2b$10$.nBUefCG4ZtzVCSUhbjb5.tcqiyZfpzfRENMJBdVqu.e.mvrDEJ3W', '01234567689', '357 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM', 'active', '2025-09-30 07:25:46', NULL, 1),
(5, 'seller', 'Phạm Văn Bành', 'banh@gmail.com', '$2b$10$zdiHx0ziAUGVrMslqzUP9.cw93BaTIzSdAVOId9yQ3B9bg.DAGDZu', '0123456789', '147 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM', 'active', '2025-09-30 07:31:08', NULL, 7),
(6, 'buyer', 'Trần Hải Đăng', 'dang@gmail.com', '$2b$10$5Q/4QYH1d/TlDwPbiV8HO.JWhdItHwsgkmm9UnVrWQCRQVnHb71OS', '0123435445', 'Số 2 Võ Oanh, Phường 25, Bình Thạnh, Hồ Chí Minh, Việt Nam', 'active', '2025-10-07 13:29:08', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhatkythaydoitonkho`
--

CREATE TABLE `nhatkythaydoitonkho` (
  `ID_NhatKy` bigint(20) NOT NULL,
  `ID_SanPham` bigint(20) NOT NULL,
  `SoLuongThayDoi` int(11) NOT NULL,
  `HanhDong` enum('import','export') NOT NULL DEFAULT 'export',
  `ThoiGian` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhatkythaydoitonkho`
--

INSERT INTO `nhatkythaydoitonkho` (`ID_NhatKy`, `ID_SanPham`, `SoLuongThayDoi`, `HanhDong`, `ThoiGian`) VALUES
(1, 26, 10, 'import', '2025-10-02 17:01:35'),
(2, 26, 10, 'import', '2025-10-04 07:02:07'),
(3, 26, 5, 'import', '2025-10-04 07:09:28'),
(4, 26, 5, 'import', '2025-10-04 07:09:38'),
(5, 26, 10, 'import', '2025-10-04 07:12:59'),
(6, 25, 18, 'import', '2025-10-05 09:41:19');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieugiamgia`
--

CREATE TABLE `phieugiamgia` (
  `ID_Phieu` bigint(20) NOT NULL,
  `MaGiam` varchar(100) NOT NULL,
  `PhanTramGiam` decimal(5,2) DEFAULT NULL,
  `SoLanDungDuoc` int(11) NOT NULL DEFAULT 1,
  `SoLanDaDung` int(11) NOT NULL DEFAULT 0,
  `GiaTriDonHangToiThieu` decimal(12,2) DEFAULT NULL,
  `NgayHieuLuc` date NOT NULL,
  `NgayHetHan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_rating_cache`
--

CREATE TABLE `product_rating_cache` (
  `ID_SanPham` int(11) NOT NULL,
  `total_reviews` int(11) DEFAULT 0,
  `count_1_star` int(11) DEFAULT 0,
  `count_2_star` int(11) DEFAULT 0,
  `count_3_star` int(11) DEFAULT 0,
  `count_4_star` int(11) DEFAULT 0,
  `count_5_star` int(11) DEFAULT 0,
  `average_rating` decimal(3,1) DEFAULT 0.0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_rating_cache`
--

INSERT INTO `product_rating_cache` (`ID_SanPham`, `total_reviews`, `count_1_star`, `count_2_star`, `count_3_star`, `count_4_star`, `count_5_star`, `average_rating`, `last_updated`) VALUES
(1, 4, 0, 0, 1, 2, 1, 4.0, '2025-10-08 12:03:56'),
(2, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(3, 4, 0, 1, 1, 1, 1, 3.5, '2025-10-08 12:03:56'),
(4, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(5, 4, 0, 0, 0, 2, 2, 4.5, '2025-10-08 12:03:56'),
(6, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(7, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(8, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(9, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(10, 4, 0, 0, 1, 0, 3, 4.5, '2025-10-08 12:03:56'),
(11, 4, 0, 0, 1, 2, 1, 4.0, '2025-10-08 12:03:56'),
(12, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(13, 4, 0, 0, 1, 1, 2, 4.3, '2025-10-08 12:03:56'),
(14, 4, 0, 0, 0, 2, 2, 4.5, '2025-10-08 12:03:56'),
(15, 4, 0, 0, 0, 2, 2, 4.5, '2025-10-08 12:03:56'),
(16, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(17, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(18, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(19, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(20, 4, 0, 0, 0, 2, 2, 4.5, '2025-10-08 12:03:56'),
(21, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(22, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(23, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(24, 4, 0, 0, 1, 2, 1, 4.0, '2025-10-08 12:03:56'),
(25, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(26, 4, 0, 0, 0, 2, 2, 4.5, '2025-10-08 12:03:56'),
(29, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(30, 4, 0, 0, 0, 0, 4, 5.0, '2025-10-08 12:03:56'),
(31, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56'),
(32, 4, 0, 0, 0, 1, 3, 4.8, '2025-10-08 12:03:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

CREATE TABLE `sanpham` (
  `ID_SanPham` bigint(20) NOT NULL,
  `ID_NguoiBan` bigint(20) NOT NULL,
  `ID_DanhMuc` int(11) NOT NULL,
  `TenSanPham` varchar(300) NOT NULL,
  `MoTa` text DEFAULT NULL,
  `Gia` decimal(12,2) NOT NULL CHECK (`Gia` >= 0),
  `TonKho` int(11) NOT NULL DEFAULT 0 CHECK (`TonKho` >= 0),
  `TrangThai` enum('active','inactive','out_of_stock') NOT NULL DEFAULT 'active',
  `CapNhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`ID_SanPham`, `ID_NguoiBan`, `ID_DanhMuc`, `TenSanPham`, `MoTa`, `Gia`, `TonKho`, `TrangThai`, `CapNhat`) VALUES
(1, 4, 1, 'Áo ba lỗ', 'Sản phẩm thời trang nam: áo ba lỗ, áo thun', 150000.00, 50, 'active', '2025-10-01 09:27:57'),
(2, 4, 2, 'Đầm váy', 'Sản phẩm thời trang nữ: đầm, váy, áo sơ mi nữ', 250000.00, 30, 'active', '2025-10-01 09:27:57'),
(3, 4, 3, 'Ốp lưng điện thoại', 'Sản phẩm điện thoại và phụ kiện: iPhone, ốp lưng', 12000000.00, 20, 'active', '2025-10-01 09:27:57'),
(4, 4, 4, 'Laptop Asus', 'Sản phẩm máy tính xách tay: Asus, Dell', 15000000.00, 0, 'out_of_stock', '2025-10-01 10:30:33'),
(5, 4, 5, 'Máy quay Sony', 'Sản phẩm máy ảnh và máy quay phim: Canon, Sony', 10000000.00, 10, 'active', '2025-10-01 09:27:57'),
(6, 4, 6, 'Đồng hồ Casio', 'Sản phẩm đồng hồ: Casio, đồng hồ thông minh', 2000000.00, 40, 'active', '2025-10-01 09:27:57'),
(7, 4, 7, 'Giày sneaker nam', 'Sản phẩm giày dép nam: sneaker, giày da', 800000.00, 60, 'active', '2025-10-01 09:27:57'),
(8, 4, 8, 'Giày cao gót', 'Sản phẩm giày dép nữ: cao gót, sandal', 600000.00, 70, 'active', '2025-10-01 09:27:57'),
(9, 4, 9, 'Túi đeo chéo nam', 'Sản phẩm túi ví nam: túi đeo chéo, ví da', 500000.00, 50, 'active', '2025-10-01 09:27:57'),
(10, 4, 10, 'Túi xách nữ', 'Sản phẩm túi ví nữ: túi xách, ví cầm tay', 700000.00, 40, 'active', '2025-10-01 09:27:57'),
(11, 4, 11, 'Tai nghe Bluetooth', 'Sản phẩm thiết bị điện tử: tai nghe, loa', 1000000.00, 25, 'active', '2025-10-01 09:27:57'),
(12, 4, 12, 'Xe máy điện', 'Sản phẩm phương tiện: xe đạp, xe máy điện', 5000000.00, 10, 'active', '2025-10-01 09:27:57'),
(13, 4, 13, 'Bàn ghế gỗ', 'Sản phẩm nhà cửa đời sống: bàn ghế, chăn ga', 3000000.00, 20, 'active', '2025-10-01 09:27:57'),
(14, 4, 14, 'Son môi', 'Sản phẩm làm đẹp: son môi, kem dưỡng da', 300000.00, 100, 'active', '2025-10-01 09:27:57'),
(15, 4, 15, 'Vitamin A', 'Sản phẩm sức khỏe: thực phẩm chức năng, vitamin', 400000.00, 80, 'active', '2025-10-01 09:27:57'),
(16, 4, 16, 'Máy chơi game PS5', 'Sản phẩm giải trí: PS5, Lego', 12000000.00, 5, 'active', '2025-10-01 09:27:57'),
(17, 4, 17, 'Sữa bột trẻ em', 'Sản phẩm mẹ & bé: sữa bột, xe đẩy', 800000.00, 30, 'active', '2025-10-01 09:27:57'),
(18, 4, 18, 'Sách Tiếng Việt lớp 4', 'Sản phẩm nhà sách online: sách giáo khoa, tiểu thuyết', 150000.00, 200, 'active', '2025-10-01 09:27:57'),
(19, 4, 19, 'Mì Omachi tôm chua cay', 'Sản phẩm bách hóa online: mì gói, nước ngọt', 50000.00, 300, 'active', '2025-10-01 09:27:57'),
(20, 4, 1, 'Áo thun xanh', 'Sản phẩm thời trang nam: áo ba lỗ, áo thun', 119000.00, 50, 'active', '2025-10-08 14:38:44'),
(21, 4, 2, 'Áo sơ mi nữ', 'Sản phẩm thời trang nữ: đầm, váy, áo sơ mi nữ', 299999.00, 30, 'active', '2025-10-01 10:44:11'),
(22, 4, 3, 'iPhone 12', 'Sản phẩm điện thoại và phụ kiện: iPhone, ốp lưng', 15000000.00, 20, 'active', '2025-10-01 10:44:11'),
(23, 4, 4, 'Laptop Lenovo', 'Sản phẩm máy tính xách tay: Asus, Dell', 25000000.00, 15, 'active', '2025-10-01 10:44:11'),
(24, 4, 5, 'Máy ảnh Sony', 'Sản phẩm máy ảnh và máy quay phim: Canon, Sony', 9000000.00, 10, 'active', '2025-10-01 10:44:11'),
(25, 3, 18, 'Sách huyền vũ yêu quái', 'Sách nói về 1 chàng trai không được bình thường và kỳ lạ, cuối cùng....', 10000.00, 30, 'active', '2025-10-05 09:41:19'),
(26, 3, 18, 'Sách quỷ diệt hồn', 'Chuyện kể về 1 nhóm anh hùng chuyên trừ gian diệt ác', 200000.00, 60, 'active', '2025-10-05 09:26:14'),
(29, 3, 18, 'Sách ARPANET', 'Sách nói về mạng máy tính đầu tiên', 200000.00, 20, 'active', '2025-10-05 10:44:52'),
(30, 3, 18, 'Sách làm giàu', 'oke á', 200000.00, 20, 'active', '2025-10-07 13:11:32'),
(31, 3, 18, 'Sách cổ tích xưa', 'woww', 300000.00, 50, 'active', '2025-10-07 04:28:25'),
(32, 3, 18, 'Sách lớp 2', 'omg', 300000.00, 30, 'active', '2025-10-07 05:05:42'),
(33, 4, 1, 'Áo thun xám', 'Chất liệu cotton, mát mẻ', 159000.00, 100, 'active', '2025-10-08 14:37:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanphamtronggio`
--

CREATE TABLE `sanphamtronggio` (
  `ID_MatHang` bigint(20) NOT NULL,
  `ID_GioHang` bigint(20) NOT NULL,
  `ID_SanPham` bigint(20) NOT NULL,
  `SoLuong` int(11) NOT NULL CHECK (`SoLuong` > 0),
  `ThemLuc` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanhtoan`
--

CREATE TABLE `thanhtoan` (
  `ID_ThanhToan` bigint(20) NOT NULL,
  `ID_DonHang` bigint(20) NOT NULL,
  `PhuongThuc` enum('COD','CBS') NOT NULL DEFAULT 'COD',
  `TrangThai` enum('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  `ThoiGianTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `ID_ThongBao` bigint(20) NOT NULL,
  `ID_NguoiNhan` bigint(20) NOT NULL,
  `Loai` enum('order','payment','report') NOT NULL DEFAULT 'order',
  `NoiDung` text DEFAULT NULL,
  `ThoiGianGui` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinnhan`
--

CREATE TABLE `tinnhan` (
  `ID_TinNhan` bigint(20) NOT NULL,
  `ID_HoiThoai` bigint(20) NOT NULL,
  `ID_NguoiGui` bigint(20) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `ThoiGianGui` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinnhananh`
--

CREATE TABLE `tinnhananh` (
  `ID_Anh` bigint(20) NOT NULL,
  `ID_TinNhan` bigint(20) NOT NULL,
  `AnhUrl` text NOT NULL,
  `ThoiGianGui` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID_NguoiDung`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Chỉ mục cho bảng `anhsanpham`
--
ALTER TABLE `anhsanpham`
  ADD PRIMARY KEY (`ID_Anh`),
  ADD KEY `fk_anhsp_sp` (`ID_SanPham`);

--
-- Chỉ mục cho bảng `apma`
--
ALTER TABLE `apma`
  ADD PRIMARY KEY (`ID_ApMa`),
  ADD UNIQUE KEY `ID_Phieu` (`ID_Phieu`,`ID_NguoiDung`),
  ADD KEY `fk_apma_nguoidung` (`ID_NguoiDung`),
  ADD KEY `fk_apma_donhang` (`ID_DonHang`);

--
-- Chỉ mục cho bảng `baocao`
--
ALTER TABLE `baocao`
  ADD PRIMARY KEY (`ID_BaoCao`),
  ADD KEY `fk_baocao_nguoibc` (`ID_NguoiBC`),
  ADD KEY `fk_baocao_nguoibibc` (`ID_NguoiBiBC`),
  ADD KEY `fk_baocao_sanpham` (`ID_SpBiBC`);

--
-- Chỉ mục cho bảng `category_product_count_cache`
--
ALTER TABLE `category_product_count_cache`
  ADD PRIMARY KEY (`ID_DanhMuc`),
  ADD KEY `idx_count` (`product_count`),
  ADD KEY `idx_updated` (`last_updated`);

--
-- Chỉ mục cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD PRIMARY KEY (`ID_ChiTietDH`),
  ADD KEY `fk_chitiet_donhang` (`ID_DonHang`),
  ADD KEY `fk_chitiet_sanpham` (`ID_SanPham`);

--
-- Chỉ mục cho bảng `cuahang`
--
ALTER TABLE `cuahang`
  ADD PRIMARY KEY (`ID_CuaHang`),
  ADD KEY `fk_cuahang_danhmuc` (`ID_DanhMuc`);

--
-- Chỉ mục cho bảng `danhgiasanpham`
--
ALTER TABLE `danhgiasanpham`
  ADD PRIMARY KEY (`ID_DanhGia`),
  ADD KEY `fk_danhgiasp_nguoimua` (`ID_NguoiMua`),
  ADD KEY `fk_danhgiasp_sp` (`ID_SanPham`);

--
-- Chỉ mục cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`ID_DanhMuc`);

--
-- Chỉ mục cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`ID_DonHang`),
  ADD KEY `fk_donhang_nguoimua` (`ID_NguoiMua`);

--
-- Chỉ mục cho bảng `giaohang`
--
ALTER TABLE `giaohang`
  ADD PRIMARY KEY (`ID_GiaoHang`),
  ADD KEY `fk_giaohang_donhang` (`ID_DonHang`);

--
-- Chỉ mục cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`ID_GioHang`),
  ADD KEY `fk_giohang_nguoimua` (`ID_NguoiMua`);

--
-- Chỉ mục cho bảng `hoithoai`
--
ALTER TABLE `hoithoai`
  ADD PRIMARY KEY (`ID_HoiThoai`),
  ADD KEY `fk_hoithoai_nguoimua` (`ID_NguoiMua`),
  ADD KEY `fk_hoithoai_nguoiban` (`ID_NguoiBan`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`ID_NguoiDung`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `fk_nguoidung_cuahang` (`ID_CuaHang`);

--
-- Chỉ mục cho bảng `nhatkythaydoitonkho`
--
ALTER TABLE `nhatkythaydoitonkho`
  ADD PRIMARY KEY (`ID_NhatKy`),
  ADD KEY `fk_nhatky_sp` (`ID_SanPham`);

--
-- Chỉ mục cho bảng `phieugiamgia`
--
ALTER TABLE `phieugiamgia`
  ADD PRIMARY KEY (`ID_Phieu`),
  ADD UNIQUE KEY `MaGiam` (`MaGiam`);

--
-- Chỉ mục cho bảng `product_rating_cache`
--
ALTER TABLE `product_rating_cache`
  ADD PRIMARY KEY (`ID_SanPham`),
  ADD KEY `idx_rating` (`average_rating`),
  ADD KEY `idx_reviews` (`total_reviews`),
  ADD KEY `idx_updated` (`last_updated`);

--
-- Chỉ mục cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`ID_SanPham`),
  ADD KEY `fk_sanpham_nguoiban` (`ID_NguoiBan`),
  ADD KEY `fk_sanpham_danhmuc` (`ID_DanhMuc`);

--
-- Chỉ mục cho bảng `sanphamtronggio`
--
ALTER TABLE `sanphamtronggio`
  ADD PRIMARY KEY (`ID_MatHang`),
  ADD UNIQUE KEY `ID_GioHang` (`ID_GioHang`,`ID_SanPham`),
  ADD KEY `fk_sptronggio_sanpham` (`ID_SanPham`);

--
-- Chỉ mục cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`ID_ThanhToan`),
  ADD KEY `fk_thanhtoan_donhang` (`ID_DonHang`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`ID_ThongBao`),
  ADD KEY `fk_thongbao_nguoi_dung` (`ID_NguoiNhan`);

--
-- Chỉ mục cho bảng `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD PRIMARY KEY (`ID_TinNhan`),
  ADD KEY `fk_tinnhan_hoithoai` (`ID_HoiThoai`),
  ADD KEY `fk_tinnhan_nguoidung` (`ID_NguoiGui`);

--
-- Chỉ mục cho bảng `tinnhananh`
--
ALTER TABLE `tinnhananh`
  ADD PRIMARY KEY (`ID_Anh`),
  ADD KEY `fk_tinnhananh_tinnhan` (`ID_TinNhan`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `ID_NguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `anhsanpham`
--
ALTER TABLE `anhsanpham`
  MODIFY `ID_Anh` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `apma`
--
ALTER TABLE `apma`
  MODIFY `ID_ApMa` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `baocao`
--
ALTER TABLE `baocao`
  MODIFY `ID_BaoCao` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  MODIFY `ID_ChiTietDH` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cuahang`
--
ALTER TABLE `cuahang`
  MODIFY `ID_CuaHang` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `danhgiasanpham`
--
ALTER TABLE `danhgiasanpham`
  MODIFY `ID_DanhGia` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  MODIFY `ID_DanhMuc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `donhang`
--
ALTER TABLE `donhang`
  MODIFY `ID_DonHang` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giaohang`
--
ALTER TABLE `giaohang`
  MODIFY `ID_GiaoHang` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giohang`
--
ALTER TABLE `giohang`
  MODIFY `ID_GioHang` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hoithoai`
--
ALTER TABLE `hoithoai`
  MODIFY `ID_HoiThoai` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `ID_NguoiDung` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `nhatkythaydoitonkho`
--
ALTER TABLE `nhatkythaydoitonkho`
  MODIFY `ID_NhatKy` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `phieugiamgia`
--
ALTER TABLE `phieugiamgia`
  MODIFY `ID_Phieu` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `ID_SanPham` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `sanphamtronggio`
--
ALTER TABLE `sanphamtronggio`
  MODIFY `ID_MatHang` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `ID_ThanhToan` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `ID_ThongBao` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tinnhan`
--
ALTER TABLE `tinnhan`
  MODIFY `ID_TinNhan` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tinnhananh`
--
ALTER TABLE `tinnhananh`
  MODIFY `ID_Anh` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `anhsanpham`
--
ALTER TABLE `anhsanpham`
  ADD CONSTRAINT `fk_anhsp_sp` FOREIGN KEY (`ID_SanPham`) REFERENCES `sanpham` (`ID_SanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `apma`
--
ALTER TABLE `apma`
  ADD CONSTRAINT `fk_apma_donhang` FOREIGN KEY (`ID_DonHang`) REFERENCES `donhang` (`ID_DonHang`),
  ADD CONSTRAINT `fk_apma_nguoidung` FOREIGN KEY (`ID_NguoiDung`) REFERENCES `nguoidung` (`ID_NguoiDung`),
  ADD CONSTRAINT `fk_apma_phieu` FOREIGN KEY (`ID_Phieu`) REFERENCES `phieugiamgia` (`ID_Phieu`);

--
-- Các ràng buộc cho bảng `baocao`
--
ALTER TABLE `baocao`
  ADD CONSTRAINT `fk_baocao_nguoibc` FOREIGN KEY (`ID_NguoiBC`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_baocao_nguoibibc` FOREIGN KEY (`ID_NguoiBiBC`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_baocao_sanpham` FOREIGN KEY (`ID_SpBiBC`) REFERENCES `sanpham` (`ID_SanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `fk_chitiet_donhang` FOREIGN KEY (`ID_DonHang`) REFERENCES `donhang` (`ID_DonHang`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_chitiet_sanpham` FOREIGN KEY (`ID_SanPham`) REFERENCES `sanpham` (`ID_SanPham`);

--
-- Các ràng buộc cho bảng `cuahang`
--
ALTER TABLE `cuahang`
  ADD CONSTRAINT `fk_cuahang_danhmuc` FOREIGN KEY (`ID_DanhMuc`) REFERENCES `danhmuc` (`ID_DanhMuc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `danhgiasanpham`
--
ALTER TABLE `danhgiasanpham`
  ADD CONSTRAINT `fk_danhgiasp_nguoimua` FOREIGN KEY (`ID_NguoiMua`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_danhgiasp_sp` FOREIGN KEY (`ID_SanPham`) REFERENCES `sanpham` (`ID_SanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `fk_donhang_nguoimua` FOREIGN KEY (`ID_NguoiMua`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `giaohang`
--
ALTER TABLE `giaohang`
  ADD CONSTRAINT `fk_giaohang_donhang` FOREIGN KEY (`ID_DonHang`) REFERENCES `donhang` (`ID_DonHang`);

--
-- Các ràng buộc cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `fk_giohang_nguoimua` FOREIGN KEY (`ID_NguoiMua`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hoithoai`
--
ALTER TABLE `hoithoai`
  ADD CONSTRAINT `fk_hoithoai_nguoiban` FOREIGN KEY (`ID_NguoiBan`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hoithoai_nguoimua` FOREIGN KEY (`ID_NguoiMua`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD CONSTRAINT `fk_nguoidung_cuahang` FOREIGN KEY (`ID_CuaHang`) REFERENCES `cuahang` (`ID_CuaHang`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `nhatkythaydoitonkho`
--
ALTER TABLE `nhatkythaydoitonkho`
  ADD CONSTRAINT `fk_nhatky_sp` FOREIGN KEY (`ID_SanPham`) REFERENCES `sanpham` (`ID_SanPham`);

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `fk_sanpham_danhmuc` FOREIGN KEY (`ID_DanhMuc`) REFERENCES `danhmuc` (`ID_DanhMuc`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sanpham_nguoiban` FOREIGN KEY (`ID_NguoiBan`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `sanphamtronggio`
--
ALTER TABLE `sanphamtronggio`
  ADD CONSTRAINT `fk_sptronggio_giohang` FOREIGN KEY (`ID_GioHang`) REFERENCES `giohang` (`ID_GioHang`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sptronggio_sanpham` FOREIGN KEY (`ID_SanPham`) REFERENCES `sanpham` (`ID_SanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `fk_thanhtoan_donhang` FOREIGN KEY (`ID_DonHang`) REFERENCES `donhang` (`ID_DonHang`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD CONSTRAINT `fk_thongbao_nguoi_dung` FOREIGN KEY (`ID_NguoiNhan`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD CONSTRAINT `fk_tinnhan_hoithoai` FOREIGN KEY (`ID_HoiThoai`) REFERENCES `hoithoai` (`ID_HoiThoai`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tinnhan_nguoidung` FOREIGN KEY (`ID_NguoiGui`) REFERENCES `nguoidung` (`ID_NguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tinnhananh`
--
ALTER TABLE `tinnhananh`
  ADD CONSTRAINT `fk_tinnhananh_tinnhan` FOREIGN KEY (`ID_TinNhan`) REFERENCES `tinnhan` (`ID_TinNhan`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
