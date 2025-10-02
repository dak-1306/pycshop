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
  name: "My Awesome Shop",
  description: "Chuyên cung cấp các sản phẩm chất lượng cao",
  avatar: null,
  isEditing: false,
  email: "contact@myawesomeshop.com",
  phone: "+84 123 456 789",
  address: "TP. Hồ Chí Minh, Việt Nam",
  website: "https://myawesomeshop.com",
  socialMedia: {
    facebook: "https://facebook.com/myawesomeshop",
    instagram: "@myawesomeshop",
    zalo: "0123456789",
  },
  policies: {
    returnPolicy: "Đổi trả miễn phí trong vòng 7 ngày",
    shippingPolicy: "Giao hàng nhanh trong 2-3 ngày",
    warrantyPolicy: "Bảo hành 12 tháng cho sản phẩm điện tử",
  },
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
    quantity: 50,
    category: "Điện tử",
    description: "Smartphone cao cấp với chip A17 Pro",
    status: "Còn hàng",
    image: null,
  },
  {
    id: 2,
    name: "Áo thun nam cotton",
    price: 199000,
    quantity: 100,
    category: "Thời trang",
    description: "Áo thun cotton 100% thoáng mát",
    status: "Còn hàng",
    image: null,
  },
  {
    id: 3,
    name: "Laptop Gaming ASUS",
    price: 25990000,
    quantity: 0,
    category: "Điện tử",
    description: "Laptop gaming hiệu năng cao",
    status: "Hết hàng",
    image: null,
  },
  {
    id: 4,
    name: "Giày thể thao Nike",
    price: 2990000,
    quantity: 75,
    category: "Thể thao",
    description: "Giày chạy bộ chuyên nghiệp",
    status: "Còn hàng",
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

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    message: "Có đơn hàng mới từ Nguyễn Văn A",
    time: "5 phút trước",
    type: "order",
    color: "green",
  },
  {
    id: 2,
    message: 'Cập nhật sản phẩm "iPhone 15 Pro Max"',
    time: "2 giờ trước",
    type: "update",
    color: "blue",
  },
  {
    id: 3,
    message: 'Thêm sản phẩm mới "Áo thun nam cotton"',
    time: "1 ngày trước",
    type: "add",
    color: "orange",
  },
];

export const SHOP_TABS = [
  { id: "basic", label: "Thông tin cơ bản", icon: "📋" },
  { id: "contact", label: "Thông tin liên hệ", icon: "📞" },
  { id: "social", label: "Mạng xã hội", icon: "🌐" },
  { id: "policies", label: "Chính sách", icon: "📜" },
];
