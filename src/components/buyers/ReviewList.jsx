import React, { useState, useEffect } from "react";
import "../../styles/components/buyer/ReviewList.css";

const ReviewList = ({ productId, newReview }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [starFilter, setStarFilter] = useState(0); // 0 = all stars
  const reviewsPerPage = 5;

  // Load reviews
  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, currentPage, starFilter]);

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

      let url = `http://localhost:5000/api/products/${productId}/reviews?page=${currentPage}&limit=${reviewsPerPage}`;
      if (starFilter > 0) {
        url += `&rating=${starFilter}`;
      }

      const response = await fetch(url);

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

  const renderStars = (rating = 0) => {
    const safeRating = rating || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-2xl text-yellow-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-2xl text-yellow-400">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-2xl text-gray-300">
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

      {/* Star Filter */}
      <div className="star-filter">
        <button
          className={`star-filter-btn ${starFilter === 0 ? "active" : ""}`}
          onClick={() => setStarFilter(0)}
        >
          Tất cả
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            className={`star-filter-btn ${starFilter === star ? "active" : ""}`}
            onClick={() => setStarFilter(star)}
          >
            {star} <span className="star-icon">★</span>
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="reviews-empty">
          <i className="fas fa-comment-slash"></i>
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
          <p>Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <>
          <div className="reviews-list">
            {(showAll ? reviews : reviews.slice(0, 3)).map((review) => (
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

          {/* Show More Button */}
          {!showAll && reviews.length > 3 && (
            <div className="show-more-container">
              <button
                className="show-more-btn"
                onClick={() => setShowAll(true)}
              >
                Xem thêm {reviews.length - 3} đánh giá
                <i className="fas fa-chevron-down"></i>
              </button>
            </div>
          )}

          {/* Show Less Button */}
          {showAll && reviews.length > 3 && (
            <div className="show-more-container">
              <button
                className="show-more-btn"
                onClick={() => setShowAll(false)}
              >
                Thu gọn
                <i className="fas fa-chevron-up"></i>
              </button>
            </div>
          )}

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
