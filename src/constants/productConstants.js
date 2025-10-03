export const PRODUCT_CATEGORIES = [
  "Tất cả",
  "Điện thoại",
  "Laptop",
  "Máy tính bảng",
  "Phụ kiện",
];

export const PRODUCT_STATUSES = ["Tất cả", "Còn hàng", "Hết hàng", "Ngừng bán"];

export const PRICE_RANGES = [
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
];

// Default stats data
export const DEFAULT_PRODUCT_STATS = {
  totalProducts: 342,
  activeProducts: 298,
  outOfStockProducts: 23,
  pendingProducts: 21,
};
