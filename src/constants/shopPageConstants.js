// ShopPage Constants

export const CATEGORIES = [
  "Thời trang",
  "Điện tử",
  "Gia dụng",
  "Sách",
  "Thể thao",
  "Làm đẹp",
];

export const SHOP_STATUS_COLORS = {
  "Còn hàng": "bg-green-100 text-green-800",
  "Hết hàng": "bg-red-100 text-red-800",
  "Ngừng bán": "bg-gray-100 text-gray-800",
};

export const DEFAULT_SHOP_INFO = {
  name: "",
  description: "",
  category_id: "",
  phone: "",
  address: "",
};

export const INITIAL_PRODUCT_STATE = {
  name: "",
  price: "",
  quantity: "",
  category: "",
  description: "",
  status: "Còn hàng",
  image: null,
};

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    original_price: 32990000,
    stock_quantity: 50,
    quantity: 50,
    category: "Điện tử",
    category_name: "Điện tử",
    description: "Smartphone cao cấp với chip A17 Pro",
    status: "Còn hàng",
    average_rating: 4.8,
    images: [
      {
        image_url: "/images/iphone15.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 2,
    name: "Áo thun nam cotton",
    price: 199000,
    original_price: 299000,
    stock_quantity: 100,
    quantity: 100,
    category: "Thời trang",
    category_name: "Thời trang",
    description: "Áo thun cotton 100% thoáng mát",
    status: "Còn hàng",
    average_rating: 4.5,
    images: [
      {
        image_url: "/images/aothun.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 3,
    name: "Laptop Gaming ASUS",
    price: 25990000,
    original_price: 28990000,
    stock_quantity: 0,
    quantity: 0,
    category: "Điện tử",
    category_name: "Điện tử",
    description: "Laptop gaming hiệu năng cao",
    status: "Hết hàng",
    average_rating: 4.7,
    images: [
      {
        image_url: "/images/laptop.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 4,
    name: "Giày thể thao Nike Air Max",
    price: 2990000,
    original_price: 3490000,
    stock_quantity: 75,
    quantity: 75,
    category: "Thể thao",
    category_name: "Thể thao",
    description: "Giày chạy bộ chuyên nghiệp với công nghệ Air Max",
    status: "Còn hàng",
    average_rating: 4.6,
    images: [
      {
        image_url: "/images/nike.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 5,
    name: "Túi xách nữ cao cấp",
    price: 1290000,
    original_price: 1590000,
    stock_quantity: 30,
    quantity: 30,
    category: "Thời trang",
    category_name: "Thời trang",
    description: "Túi xách da thật thiết kế sang trọng",
    status: "Còn hàng",
    average_rating: 4.9,
    images: [
      {
        image_url: "/images/bag.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 6,
    name: "Đồng hồ thông minh Apple Watch",
    price: 8990000,
    original_price: 9990000,
    stock_quantity: 20,
    quantity: 20,
    category: "Điện tử",
    category_name: "Điện tử",
    description: "Đồng hồ thông minh theo dõi sức khỏe",
    status: "Còn hàng",
    average_rating: 4.8,
    images: [
      {
        image_url: "/images/watch.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
];

export const PAGINATION_CONFIG = {
  itemsPerPage: 12,
  maxVisiblePages: 5,
};

export const MODAL_MODES = {
  ADD: "add",
  EDIT: "edit",
};

// Recent activities will be loaded from API
export const RECENT_ACTIVITIES = [];
