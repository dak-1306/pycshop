// User management constants

export const USER_ROLES = ["Tất cả", "customer", "seller", "admin"];

export const USER_STATUSES = ["Tất cả", "active", "inactive", "banned"];

export const USER_STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  banned: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export const USER_ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-800",
  seller: "bg-blue-100 text-blue-800",
  customer: "bg-gray-100 text-gray-800",
  default: "bg-gray-100 text-gray-800",
};

// Mock users data
export const MOCK_USERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    role: "customer",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-10-01",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    role: "seller",
    status: "active",
    joinDate: "2024-02-20",
    lastLogin: "2024-09-30",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    role: "customer",
    status: "inactive",
    joinDate: "2024-03-10",
    lastLogin: "2024-08-15",
  },
];

// Default stats data
export const DEFAULT_USER_STATS = {
  totalUsers: 1248,
  activeUsers: 1156,
  customers: 956,
  sellers: 289,
};
