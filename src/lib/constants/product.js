// Product constants
export const PRODUCT_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
  OUT_OF_STOCK: "out_of_stock",
};

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUSES.ACTIVE]: "Đang bán",
  [PRODUCT_STATUSES.INACTIVE]: "Ngừng bán",
  [PRODUCT_STATUSES.DRAFT]: "Bản nháp",
  [PRODUCT_STATUSES.OUT_OF_STOCK]: "Hết hàng",
};

export const PRODUCT_STATUS_COLORS = {
  [PRODUCT_STATUSES.ACTIVE]: "bg-green-100 text-green-800",
  [PRODUCT_STATUSES.INACTIVE]: "bg-red-100 text-red-800",
  [PRODUCT_STATUSES.DRAFT]: "bg-yellow-100 text-yellow-800",
  [PRODUCT_STATUSES.OUT_OF_STOCK]: "bg-gray-100 text-gray-800",
};

export const PRODUCT_CATEGORIES = [
  { id: "electronics", name: "Điện tử", slug: "dien-tu" },
  { id: "fashion", name: "Thời trang", slug: "thoi-trang" },
  { id: "home", name: "Nhà cửa & Đời sống", slug: "nha-cua-doi-song" },
  { id: "sports", name: "Thể thao & Du lịch", slug: "the-thao-du-lich" },
  { id: "beauty", name: "Làm đẹp", slug: "lam-dep" },
  { id: "books", name: "Sách", slug: "sach" },
  { id: "toys", name: "Đồ chơi", slug: "do-choi" },
];

export const PRICE_RANGES = [
  { key: "all", label: "Tất cả mức giá", min: 0, max: Infinity },
  { key: "under-100k", label: "Dưới 100.000đ", min: 0, max: 100000 },
  { key: "100k-500k", label: "100.000đ - 500.000đ", min: 100000, max: 500000 },
  { key: "500k-1m", label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  {
    key: "1m-5m",
    label: "1.000.000đ - 5.000.000đ",
    min: 1000000,
    max: 5000000,
  },
  { key: "over-5m", label: "Trên 5.000.000đ", min: 5000000, max: Infinity },
];

export const PRODUCT_SORT_OPTIONS = [
  { key: "newest", label: "Mới nhất", field: "created_at", order: "desc" },
  { key: "oldest", label: "Cũ nhất", field: "created_at", order: "asc" },
  { key: "name-asc", label: "Tên A-Z", field: "name", order: "asc" },
  { key: "name-desc", label: "Tên Z-A", field: "name", order: "desc" },
  { key: "price-low", label: "Giá thấp đến cao", field: "price", order: "asc" },
  {
    key: "price-high",
    label: "Giá cao đến thấp",
    field: "price",
    order: "desc",
  },
  { key: "popular", label: "Phổ biến", field: "order_count", order: "desc" },
];

export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  MAX_COUNT: 10,
  PLACEHOLDER: "/images/placeholder-product.jpg",
};
