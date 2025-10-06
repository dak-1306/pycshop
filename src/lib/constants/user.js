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
