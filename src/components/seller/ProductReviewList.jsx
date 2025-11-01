import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { reviewService } from "../../lib/services/reviewService";

const ProductReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const reviewsPerPage = 5;

  // Load reviews and stats
  useEffect(() => {
    const loadData = async () => {
      if (productId) {
        await loadReviews();
        if (currentPage === 1) {
          await loadReviewStats();
        }
      }
    };
    loadData();
  }, [productId, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await reviewService.getProductReviews(
        productId,
        currentPage,
        reviewsPerPage
      );

      if (result.success) {
        setReviews(result.data || []);
        setTotalPages(result.totalPages || 1);
      } else {
        throw new Error(result.error || "Lỗi khi tải đánh giá");
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      setError("Không thể tải đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const loadReviewStats = async () => {
    try {
      const result = await reviewService.getReviewStats(productId);
      if (result.success) {
        setReviewStats(result.data);
      }
    } catch (error) {
      console.error("Error loading review stats:", error);
      // Keep default stats if API fails
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

  const renderStars = (rating = 0, size = "text-base") => {
    const safeRating = rating || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={["fas", "star"]}
          className={`${size} text-yellow-400`}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={["fas", "star-half-alt"]}
          className={`${size} text-yellow-400`}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={["far", "star"]}
          className={`${size} text-gray-300`}
        />
      );
    }

    return stars;
  };

  const renderRatingBar = (rating, count) => {
    const percentage =
      reviewStats.totalReviews > 0
        ? (count / reviewStats.totalReviews) * 100
        : 0;

    return (
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1 w-12">
          <span>{rating}</span>
          <FontAwesomeIcon
            icon={["fas", "star"]}
            className="text-yellow-400 text-xs"
          />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-gray-600 w-8 text-right">{count}</span>
      </div>
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-500">
            <FontAwesomeIcon
              icon={["fas", "spinner"]}
              className="animate-spin"
            />
            <span>Đang tải đánh giá...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
            <span className="font-medium">Lỗi tải đánh giá</span>
          </div>
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <button
            onClick={loadReviews}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Review Stats Summary */}
      {reviewStats.totalReviews > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(reviewStats.averageRating, "text-lg")}
              </div>
              <div className="text-sm text-gray-600">
                {reviewStats.totalReviews} đánh giá
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating}>
                  {renderRatingBar(
                    rating,
                    reviewStats.ratingBreakdown[rating] || 0
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon
              icon={["far", "comment-dots"]}
              className="text-2xl text-gray-400"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có đánh giá
          </h3>
          <p className="text-gray-500 text-sm">
            Sản phẩm này chưa có đánh giá nào từ khách hàng.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.ID_DanhGia}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {(review.user_name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {review.user_name || "Khách hàng ẩn danh"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(review.ThoiGian)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {renderStars(review.TyLe, "text-sm")}
                </div>
              </div>

              {review.BinhLuan && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.BinhLuan}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <FontAwesomeIcon icon={["fas", "chevron-left"]} />
                <span>Trước</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                {loading && (
                  <FontAwesomeIcon
                    icon={["fas", "spinner"]}
                    className="animate-spin text-gray-400"
                  />
                )}
              </div>

              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <span>Sau</span>
                <FontAwesomeIcon icon={["fas", "chevron-right"]} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ProductReviewList.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default ProductReviewList;
