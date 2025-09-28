create database pycshop;
use pycshop;

create table NguoiDung (
    ID_NguoiDung bigint auto_increment primary key,
    VaiTro enum('seller', 'buyer') not null default 'buyer',
    HoTen varchar(200) not null,
    Email varchar(255) not null unique,
    MatKhau varchar(255) not null,
    SoDienThoai varchar(50),
    DiaChi text,
    TrangThai enum('active','block') not null default 'active',
    ThoiGianTao timestamp DEFAULT current_timestamp,
    AvatarUrl varchar(500) default null
);

create table Admin (
	ID_NguoiDung int auto_increment primary key,
    HoTen varchar(200) not null,
    Email varchar(255) not null unique,
    MatKhau varchar(255) not null
);

create table ThongBao (
	ID_ThongBao bigint auto_increment primary key,
    ID_NguoiNhan bigint not null,
    Loai enum('order','payment','report') not null default 'order',
    NoiDung text,
    ThoiGianGui timestamp DEFAULT current_timestamp,
    constraint fk_thongbao_nguoi_dung foreign key (ID_NguoiNhan) references NguoiDung(ID_NguoiDung) on delete cascade 
);

create table DanhMuc (
	ID_DanhMuc int auto_increment primary key,
    TenDanhMuc varchar(150) not null,
    MoTa text
);

create table SanPham (
	ID_SanPham bigint auto_increment primary key,
    ID_NguoiBan bigint not null,
    ID_DanhMuc int not null,
    TenSanPham varchar(300) not null,
    MoTa text ,	
    Gia decimal(12,2) not null check (Gia >= 0),
    TonKho int not null default 0 check (TonKho >= 0),
    TrangThai enum('active','inactive','out_of_stock') not null default 'active',
    CapNhat timestamp default current_timestamp on update current_timestamp,
	constraint fk_sanpham_nguoiban foreign key (ID_NguoiBan) references NguoiDung(ID_NguoiDung) on delete cascade ,
    constraint fk_sanpham_danhmuc foreign key (ID_DanhMuc) references DanhMuc(ID_DanhMuc) on delete cascade 
);


create table DanhGiaSanPham (
	ID_DanhGia bigint auto_increment primary key,
    ID_SanPham bigint not null,
    ID_NguoiMua bigint not null,
    BinhLuan text,
    TyLe int not null,
    ThoiGian timestamp default current_timestamp,
    constraint fk_danhgiasp_nguoimua foreign key (ID_NguoiMua) references NguoiDung(ID_NguoiDung) on delete cascade ,
    constraint fk_danhgiasp_sp foreign key (ID_SanPham) references SanPham(ID_SanPham) on delete cascade 
);

create table AnhSanPham (
	ID_Anh bigint auto_increment primary key,
    ID_SanPham bigint not null,
    Url text not null,
    Upload_at timestamp default current_timestamp,
    constraint fk_anhsp_sp foreign key (ID_SanPham) references SanPham(ID_SanPham) on delete cascade 
);

create table BaoCao (
	ID_BaoCao bigint auto_increment primary key,
    ID_NguoiBC bigint not null,
    ID_NguoiBiBC bigint,
    ID_SpBiBC bigint,
    LoaiBaoCao enum('User', 'Product') not null,
    LiDo text not null,
    TrangThai enum('in_progress','resolved') not null default 'in_progress',
    ThoiGianTao timestamp default current_timestamp,
    constraint fk_baocao_nguoibc foreign key (ID_NguoiBC) references NguoiDung(ID_NguoiDung) on delete cascade ,
    constraint fk_baocao_nguoibibc foreign key (ID_NguoiBiBC) references NguoiDung(ID_NguoiDung) on delete cascade ,
    constraint fk_baocao_sanpham foreign key (ID_SpBiBC) references SanPham(ID_SanPham) on delete cascade 
);



create table NhatKyThayDoiTonKho (
	ID_NhatKy bigint auto_increment primary key,
    ID_SanPham bigint not null,
    SoLuongThayDoi int not null,
    HanhDong enum('import','export') not null default 'export',
    ThoiGian timestamp default current_timestamp,
    constraint fk_nhatky_sp foreign key (ID_SanPham) references SanPham(ID_SanPham)
);

create table HoiThoai (
	ID_HoiThoai bigint auto_increment primary key,
    ID_NguoiBan bigint not null,
    ID_NguoiMua bigint not null,
    ThoiGianTao timestamp default current_timestamp,
    constraint fk_hoithoai_nguoimua foreign key (ID_NguoiMua) references NguoiDung(ID_NguoiDung) on delete cascade,
    constraint fk_hoithoai_nguoiban foreign key (ID_NguoiBan) references NguoiDung(ID_NguoiDung) on delete cascade 
);

create table TinNhan (
	ID_TinNhan bigint auto_increment primary key,
    ID_HoiThoai bigint not null,
    ID_NguoiGui bigint not null,
    NoiDung text,
    ThoiGianGui timestamp default current_timestamp,
    constraint fk_tinnhan_hoithoai foreign key (ID_HoiThoai) references HoiThoai(ID_HoiThoai) on delete cascade,
    constraint fk_tinnhan_nguoidung foreign key (ID_NguoiGui) references NguoiDung(ID_NguoiDung) on delete cascade
);

create table TinNhanAnh (
	ID_Anh bigint auto_increment primary key,
    ID_TinNhan bigint not null,
    AnhUrl text not null,
    ThoiGianGui timestamp default current_timestamp,
    constraint fk_tinnhananh_tinnhan foreign key (ID_TinNhan) references TinNhan(ID_TinNhan) on delete cascade
);

create table GioHang (
	ID_GioHang bigint auto_increment primary key,
    ID_NguoiMua bigint not null,
    ThoiGianTao timestamp default current_timestamp,
    constraint fk_giohang_nguoimua foreign key (ID_NguoiMua) references NguoiDung(ID_NguoiDung) on delete cascade
);

create table SanPhamTrongGio (
    ID_MatHang bigint auto_increment primary key,
    ID_GioHang bigint not null,
    ID_SanPham bigint not null,
    SoLuong int not null check (SoLuong > 0),
    ThemLuc timestamp default current_timestamp,
    unique(ID_GioHang, ID_SanPham),
    constraint fk_sptronggio_giohang foreign key (ID_GioHang) references GioHang(ID_GioHang) on delete cascade,
    constraint fk_sptronggio_sanpham foreign key (ID_SanPham) references SanPham(ID_SanPham) on delete cascade
);

create table DonHang (
	ID_DonHang bigint auto_increment primary key,
    ID_NguoiMua bigint not null,
    TongGia decimal(12,2) not null check (TongGia >= 0),
    ThoiGianTao timestamp default current_timestamp,
    TrangThai enum('pending','confirmed', 'shipped', 'cancelled') not null default 'pending',
    constraint fk_donhang_nguoimua foreign key (ID_NguoiMua) references NguoiDung(ID_NguoiDung) on delete cascade
);

create table ThanhToan (
	ID_ThanhToan bigint auto_increment primary key,
    ID_DonHang bigint not null,
    PhuongThuc enum('COD','CBS') not null default 'COD',
    TrangThai enum('paid','unpaid') not null default 'unpaid',
	ThoiGianTao timestamp default current_timestamp,
    constraint fk_thanhtoan_donhang foreign key (ID_DonHang) references DonHang(ID_DonHang) on delete cascade
);

create table ChiTietDonHang (
	ID_ChiTietDH bigint auto_increment primary key,
    ID_DonHang bigint not null,
    ID_SanPham bigint not null,
    DonGia decimal(12,2) not null check (DonGia >= 0),
    SoLuong int not null ,
    constraint fk_chitiet_donhang foreign key (ID_DonHang) references DonHang(ID_DonHang) on delete cascade,
    constraint fk_chitiet_sanpham foreign key (ID_SanPham) references SanPham(ID_SanPham)
);

create table GiaoHang (
	ID_GiaoHang bigint auto_increment primary key,
    ID_DonHang bigint not null,
    DiaChi text not null,
    TrangThai enum('undelivery','out_for_delivery','delivered'),
    NgayVanChuyen timestamp,
    NgayGiaoToi timestamp,
    constraint fk_giaohang_donhang foreign key (ID_DonHang) references DonHang(ID_DonHang)
);

create table PhieuGiamGia (
	ID_Phieu bigint auto_increment primary key,
    MaGiam varchar(100) not null unique,
    PhanTramGiam decimal(5,2),
    SoLanDungDuoc int not null default 1,
    SoLanDaDung  int not null default 0,
    GiaTriDonHangToiThieu decimal(12,2),
    NgayHieuLuc date not null,
    NgayHetHan date not null
);

create table ApMa (
	ID_ApMa bigint auto_increment primary key,
    ID_Phieu bigint not null,
    ID_NguoiDung bigint not null,
    ID_DonHang bigint not null,
    SuDungLuc timestamp default current_timestamp,
    unique(ID_Phieu, ID_NguoiDung),
    constraint fk_apma_phieu foreign key (ID_Phieu) references PhieuGiamGia(ID_Phieu),
    constraint fk_apma_nguoidung foreign key (ID_NguoiDung) references NguoiDung(ID_NguoiDung),
    constraint fk_apma_donhang foreign key (ID_DonHang) references DonHang(ID_DonHang)
);








