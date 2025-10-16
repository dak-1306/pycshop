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

// Additional constants from productConstants.js
export const PRODUCT_CATEGORIES_ARRAY = [
  "Điện tử",
  "Thời trang",
  "Gia dụng",
  "Thể thao",
  "Sách & Văn phòng phẩm",
  "Mỹ phẩm",
];

export const PRODUCT_STATUSES_ARRAY = [
  "active",
  "inactive",
  "pending",
  "out_of_stock",
];

export const PRICE_RANGES_ARRAY = [
  "Tất cả",
  "Dưới 10 triệu",
  "10-20 triệu",
  "20-30 triệu",
  "Trên 30 triệu",
];

export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 10,
  VISIBLE_PAGES: 5,
};

// Mock products data
export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Điện tử",
    price: 32000000,
    stock: 15,
    seller: "TechStore VN",
    status: "active",
    createdDate: "2024-09-15",
  },
  {
    id: 2,
    name: "Áo thun nam cotton",
    category: "Thời trang",
    price: 199000,
    stock: 0,
    seller: "Fashion House",
    status: "out_of_stock",
    createdDate: "2024-09-20",
  },
  {
    id: 3,
    name: "Laptop Dell XPS 13",
    category: "Điện tử",
    price: 25000000,
    stock: 8,
    seller: "Computer World",
    status: "active",
    createdDate: "2024-09-25",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    category: "Điện tử",
    price: 28000000,
    stock: 20,
    seller: "Mobile Store",
    status: "pending",
    createdDate: "2024-09-28",
  },
  {
    id: 5,
    name: "Giày thể thao Nike",
    category: "Thời trang",
    price: 2500000,
    stock: 5,
    seller: "Sports Shop",
    status: "active",
    createdDate: "2024-09-30",
  },
  {
    id: 6,
    name: "Máy pha cà phê",
    category: "Gia dụng",
    price: 3500000,
    stock: 0,
    seller: "Home Appliances",
    status: "out_of_stock",
    createdDate: "2024-10-01",
  },
  {
    id: 7,
    name: "Sách lập trình Python",
    category: "Sách & Văn phòng phẩm",
    price: 350000,
    stock: 100,
    seller: "BookStore",
    status: "active",
    createdDate: "2024-10-02",
  },
  {
    id: 8,
    name: "Kem dưỡng da",
    category: "Mỹ phẩm",
    price: 450000,
    stock: 30,
    seller: "Beauty Shop",
    status: "inactive",
    createdDate: "2024-10-03",
  },
];

// Default stats data
export const DEFAULT_PRODUCT_STATS = {
  totalProducts: 342,
  activeProducts: 298,
  outOfStockProducts: 23,
  pendingProducts: 21,
};
