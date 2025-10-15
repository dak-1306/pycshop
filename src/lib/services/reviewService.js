const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const reviewService = {
  // Thêm đánh giá mới
  createReview: async (reviewData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tạo đánh giá");
      }

      return {
        success: true,
        data: data.data,
        message: data.message || "Đánh giá đã được tạo thành công",
      };
    } catch (error) {
      console.error("Error creating review:", error);
      return {
        success: false,
        error: error.message || "Lỗi khi tạo đánh giá",
      };
    }
  },

  // Lấy danh sách đánh giá của sản phẩm
  getProductReviews: async (productId, page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}/reviews?page=${page}&limit=${limit}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tải đánh giá");
      }

      return {
        success: true,
        data: data.data,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        total: data.total,
      };
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return {
        success: false,
        error: error.message || "Lỗi khi tải đánh giá",
        data: [],
      };
    }
  },

  // Kiểm tra xem user đã đánh giá sản phẩm này chưa
  checkUserReview: async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, hasReviewed: false };
      }

      const response = await fetch(
        `${API_BASE_URL}/api/reviews/check/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi kiểm tra đánh giá");
      }

      return {
        success: true,
        hasReviewed: data.hasReviewed,
        review: data.review,
      };
    } catch (error) {
      console.error("Error checking review:", error);
      return {
        success: false,
        hasReviewed: false,
        error: error.message,
      };
    }
  },
};
