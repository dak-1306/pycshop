export const PRODUCT_CATEGORIES = [
  "Điện tử",
  "Thời trang",
  "Gia dụng",
  "Thể thao",
  "Sách & Văn phòng phẩm",
  "Mỹ phẩm",
];

export const PRODUCT_STATUSES = [
  "active",
  "inactive", 
  "pending",
  "out_of_stock",
];

export const PRODUCT_STATUS_LABELS = {
  "active": "Hoạt động",
  "inactive": "Tạm dừng",
  "pending": "Chờ duyệt", 
  "out_of_stock": "Hết hàng",
};

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
