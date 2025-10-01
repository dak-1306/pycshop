import { api } from "./apiService";

// Auth service để xử lý các API liên quan đến authentication
export const authService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Lưu token và user info vào localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xóa local data dù API có lỗi
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Lấy user hiện tại từ localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
