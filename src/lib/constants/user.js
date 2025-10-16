// User constants
export const USER_ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  BUYER: "buyer",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Quản trị viên",
  [USER_ROLES.SELLER]: "Người bán",
  [USER_ROLES.BUYER]: "Khách hàng",
};

export const USER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  BANNED: "banned",
  PENDING: "pending",
};

export const USER_STATUS_LABELS = {
  [USER_STATUSES.ACTIVE]: "Hoạt động",
  [USER_STATUSES.INACTIVE]: "Không hoạt động",
  [USER_STATUSES.BANNED]: "Bị khóa",
  [USER_STATUSES.PENDING]: "Chờ xác thực",
};

export const USER_STATUS_COLORS = {
  [USER_STATUSES.ACTIVE]: "bg-green-100 text-green-800",
  [USER_STATUSES.INACTIVE]: "bg-yellow-100 text-yellow-800",
  [USER_STATUSES.BANNED]: "bg-red-100 text-red-800",
  [USER_STATUSES.PENDING]: "bg-blue-100 text-blue-800",
};

export const GENDER_OPTIONS = [
  { key: "male", label: "Nam" },
  { key: "female", label: "Nữ" },
  { key: "other", label: "Khác" },
];

export const AVATAR_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  DEFAULT: "/images/default-avatar.png",
};

// Additional constants from userConstants.js
export const USER_ROLES_ARRAY = ["Tất cả", "customer", "seller", "admin"];

export const USER_STATUSES_ARRAY = ["Tất cả", "active", "inactive", "banned"];

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
