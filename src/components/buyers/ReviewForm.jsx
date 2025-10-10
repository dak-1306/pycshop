import React, { useState } from "react";
import "./ReviewForm.css";

const ReviewForm = ({ productId, onReviewSubmitted, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Bình luận phải có ít nhất 10 ký tự");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để đánh giá");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          rating: rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi gửi đánh giá");
      }

      // Reset form
      setRating(0);
      setComment("");

      // Callback để parent component biết đánh giá đã được gửi
      if (onReviewSubmitted) {
        onReviewSubmitted(data.data);
      }

      // Close form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.message || "Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Rất tệ";
      case 2:
        return "Tệ";
      case 3:
        return "Trung bình";
      case 4:
        return "Tốt";
      case 5:
        return "Rất tốt";
      default:
        return "Chọn số sao";
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h3>Đánh giá sản phẩm</h3>
          <button className="review-form-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {error && <div className="review-form-error">{error}</div>}

          <div className="review-form-group">
            <label className="review-form-label">Đánh giá của bạn:</label>
            <div className="review-rating-container">
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`review-star ${
                      star <= (hoverRating || rating) ? "active" : ""
                    }`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="review-rating-text">
                {getRatingText(hoverRating || rating)}
              </span>
            </div>
          </div>

          <div className="review-form-group">
            <label className="review-form-label" htmlFor="comment">
              Nhận xét của bạn:
            </label>
            <textarea
              id="comment"
              className="review-form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
              maxLength={500}
              required
            />
            <div className="review-form-char-count">
              {comment.length}/500 ký tự
            </div>
          </div>

          <div className="review-form-actions">
            <button
              type="button"
              className="review-form-btn review-form-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="review-form-btn review-form-btn-submit"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
