import React, { useState, useEffect } from "react";
import "./ReviewList.css";

const ReviewList = ({ productId, newReview }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reviewsPerPage = 5;

  // Load reviews
  useEffect(() => {
    loadReviews();
  }, [productId, currentPage]);

  // Add new review to list when received
  useEffect(() => {
    if (newReview) {
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    }
  }, [newReview]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/reviews?page=${currentPage}&limit=${reviewsPerPage}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tải đánh giá");
      }

      setReviews(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setError("Không thể tải đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`review-star ${i <= rating ? "active" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="reviews-section">
        <h3>Đánh giá sản phẩm</h3>
        <div className="reviews-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Đang tải đánh giá...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-section">
        <h3>Đánh giá sản phẩm</h3>
        <div className="reviews-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={loadReviews} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <h3>Đánh giá sản phẩm</h3>

      {reviews.length === 0 ? (
        <div className="reviews-empty">
          <i className="fas fa-comment-slash"></i>
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
          <p>Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <>
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.ID_DanhGia} className="review-item">
                <div className="review-header">
                  <div className="review-user-info">
                    <div className="review-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="review-user-details">
                      <div className="review-username">
                        {review.user_name || "Người dùng ẩn danh"}
                      </div>
                      <div className="review-date">
                        {formatDate(review.ThoiGian)}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.TyLe)}
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.BinhLuan}</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="reviews-pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
                Trước
              </button>

              <div className="pagination-info">
                Trang {currentPage} / {totalPages}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
