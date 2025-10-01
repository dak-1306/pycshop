-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 01, 2025 lúc 05:04 PM
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
  `AvatarUrl` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`ID_NguoiDung`, `VaiTro`, `HoTen`, `Email`, `MatKhau`, `SoDienThoai`, `DiaChi`, `TrangThai`, `ThoiGianTao`, `AvatarUrl`) VALUES
(3, 'buyer', 'Nguyễn Văn Test', 'test@gmail.com', '$2b$10$kyTNrvfNiY2YcWIsctNm8O6Z08YJVJRNdIwNmgjlgGANAq7kNjrjm', '0123456789', '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', 'active', '2025-09-29 10:46:02', NULL),
(4, 'seller', 'Trần Tuấn Anh', 'anh@gmail.com', '$2b$10$.nBUefCG4ZtzVCSUhbjb5.tcqiyZfpzfRENMJBdVqu.e.mvrDEJ3W', '01234567689', '357 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM', 'active', '2025-09-30 07:25:46', NULL),
(5, 'buyer', 'Phạm Văn Bành', 'banh@gmail.com', '$2b$10$zdiHx0ziAUGVrMslqzUP9.cw93BaTIzSdAVOId9yQ3B9bg.DAGDZu', '0123456789', '147 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM', 'active', '2025-09-30 07:31:08', NULL);

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
(20, 4, 1, 'Áo thun', 'Sản phẩm thời trang nam: áo ba lỗ, áo thun', 119000.00, 50, 'active', '2025-10-01 10:44:11'),
(21, 4, 2, 'Áo sơ mi nữ', 'Sản phẩm thời trang nữ: đầm, váy, áo sơ mi nữ', 299999.00, 30, 'active', '2025-10-01 10:44:11'),
(22, 4, 3, 'iPhone 12', 'Sản phẩm điện thoại và phụ kiện: iPhone, ốp lưng', 15000000.00, 20, 'active', '2025-10-01 10:44:11'),
(23, 4, 4, 'Laptop Lenovo', 'Sản phẩm máy tính xách tay: Asus, Dell', 25000000.00, 15, 'active', '2025-10-01 10:44:11'),
(24, 4, 5, 'Máy ảnh Sony', 'Sản phẩm máy ảnh và máy quay phim: Canon, Sony', 9000000.00, 10, 'active', '2025-10-01 10:44:11');

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
-- Chỉ mục cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD PRIMARY KEY (`ID_ChiTietDH`),
  ADD KEY `fk_chitiet_donhang` (`ID_DonHang`),
  ADD KEY `fk_chitiet_sanpham` (`ID_SanPham`);

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
  ADD UNIQUE KEY `Email` (`Email`);

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
  MODIFY `ID_Anh` bigint(20) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT cho bảng `danhgiasanpham`
--
ALTER TABLE `danhgiasanpham`
  MODIFY `ID_DanhGia` bigint(20) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ID_NguoiDung` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `nhatkythaydoitonkho`
--
ALTER TABLE `nhatkythaydoitonkho`
  MODIFY `ID_NhatKy` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `phieugiamgia`
--
ALTER TABLE `phieugiamgia`
  MODIFY `ID_Phieu` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `ID_SanPham` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
