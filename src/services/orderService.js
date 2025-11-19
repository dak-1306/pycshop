import axios from "axios";

const ORDER_SERVICE_URL = "http://localhost:5000/orders"; // Thông qua API Gateway

class OrderService {
  constructor() {
    this.api = axios.create({
      baseURL: ORDER_SERVICE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor để thêm token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để xử lý lỗi
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "[ORDER_SERVICE] API Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Lấy danh sách đơn hàng của user
  async getUserOrders(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lấy chi tiết đơn hàng theo ID
  async getOrderById(orderId) {
    try {
      const response = await this.api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const response = await this.api.post("/", orderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Hủy đơn hàng
  async cancelOrder(orderId) {
    try {
      const response = await this.api.delete(`/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Xử lý lỗi
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        return {
          success: false,
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          code: "AUTH_ERROR",
        };
      } else if (status === 404) {
        return {
          success: false,
          message: data.message || "Không tìm thấy đơn hàng.",
          code: "NOT_FOUND",
        };
      } else if (status >= 500) {
        return {
          success: false,
          message: "Lỗi hệ thống. Vui lòng thử lại sau.",
          code: "SERVER_ERROR",
        };
      } else {
        return {
          success: false,
          message: data.message || "Có lỗi xảy ra. Vui lòng thử lại.",
          code: "CLIENT_ERROR",
        };
      }
    } else if (error.request) {
      return {
        success: false,
        message:
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
        code: "NETWORK_ERROR",
      };
    } else {
      return {
        success: false,
        message: "Có lỗi không mong muốn xảy ra.",
        code: "UNKNOWN_ERROR",
      };
    }
  }
}

// Export singleton instance
export default new OrderService();
