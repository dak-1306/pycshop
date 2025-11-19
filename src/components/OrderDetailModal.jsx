import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../services/orderService";
import "../styles/components/OrderDetailModal.css";

const OrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetail();
    }
  }, [isOpen, orderId]);

  const loadOrderDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await OrderService.getOrderById(orderId);
      console.log("Order detail response:", response);

      if (response.success) {
        setOrderDetail(response.data);
      } else {
        setError(response.message || "Không thể tải chi tiết đơn hàng");
      }
    } catch (error) {
      console.error("Failed to load order detail:", error);
      setError("Có lỗi xảy ra khi tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseInt(price).toLocaleString("vi-VN") + "₫";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { text: "Chờ xác nhận", icon: "fa-clock", class: "pending" };
      case "confirmed":
        return {
          text: "Chờ giao hàng",
          icon: "fa-shipping-fast",
          class: "confirmed",
        };
      case "shipped":
        return { text: "Đã nhận", icon: "fa-check-circle", class: "shipped" };
      case "cancelled":
        return { text: "Đã hủy", icon: "fa-times-circle", class: "cancelled" };
      case "completed":
        return {
          text: "Hoàn thành",
          icon: "fa-check-circle",
          class: "completed",
        };
      default:
        return {
          text: "Chờ xác nhận",
          icon: "fa-hourglass-half",
          class: "pending",
        };
    }
  };

  const handleProductClick = (productId) => {
    // Đóng modal trước khi navigate
    onClose();
    // Navigate tới trang chi tiết sản phẩm
    navigate(`/product/${productId}`);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const statusInfo = orderDetail ? getStatusInfo(orderDetail.status) : null;

  return (
    <div className="order-detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="order-detail-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-receipt"></i>
            Chi tiết đơn hàng #{orderId}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Đang tải chi tiết đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="modal-error">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>{error}</p>
              <button className="retry-btn" onClick={loadOrderDetail}>
                <i className="fas fa-redo"></i>
                Thử lại
              </button>
            </div>
          ) : orderDetail ? (
            <>
              {/* Order Status */}
              <div className="order-status-section">
                <div className="status-card">
                  <div className="status-icon">
                    <i className={`fas ${statusInfo.icon}`}></i>
                  </div>
                  <div className="status-info">
                    <h3>Trạng thái đơn hàng</h3>
                    <div className={`status-badge status-${statusInfo.class}`}>
                      {statusInfo.text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="order-info-section">
                <h3>
                  <i className="fas fa-info-circle"></i>
                  Thông tin đơn hàng
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Ngày đặt:</span>
                    <span className="info-value">
                      {formatDate(orderDetail.createdAt)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phương thức thanh toán:</span>
                    <span className="info-value">
                      {orderDetail.paymentMethod === "COD"
                        ? "Thanh toán khi nhận hàng"
                        : orderDetail.paymentMethod}
                    </span>
                  </div>
                  {orderDetail.shippingAddress && (
                    <div className="info-item full-width">
                      <span className="info-label">Địa chỉ giao hàng:</span>
                      <span className="info-value address">
                        {orderDetail.shippingAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Products List */}
              <div className="products-section">
                <h3>
                  <i className="fas fa-box"></i>
                  Sản phẩm đã đặt ({orderDetail.items?.length || 0} sản phẩm)
                </h3>
                <div className="products-list">
                  {orderDetail.items && orderDetail.items.length > 0 ? (
                    orderDetail.items.map((item, index) => (
                      <div key={index} className="product-item">
                        <div className="product-info">
                          <div
                            className="product-name"
                            onClick={() => handleProductClick(item.productId)}
                            title="Click để xem chi tiết sản phẩm"
                          >
                            <i className="fas fa-external-link-alt"></i>
                            {item.productName || `Sản phẩm #${item.productId}`}
                          </div>
                          <div className="product-meta">
                            <span className="product-price">
                              Đơn giá: {formatPrice(item.price)}
                            </span>
                            <span className="product-quantity">
                              Số lượng: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="product-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-products">
                      <i className="fas fa-box-open"></i>
                      <p>Không có sản phẩm trong đơn hàng này</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary-section">
                <h3>
                  <i className="fas fa-calculator"></i>
                  Tổng kết đơn hàng
                </h3>
                <div className="summary-card">
                  <div className="summary-row">
                    <span>Tổng tiền hàng:</span>
                    <span>
                      {orderDetail.orderDetails?.subtotal
                        ? formatPrice(orderDetail.orderDetails.subtotal)
                        : orderDetail.items
                        ? formatPrice(
                            orderDetail.items.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                          )
                        : formatPrice(orderDetail.totalAmount)}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {orderDetail.orderDetails?.shippingFee ? (
                        orderDetail.orderDetails.shippingFee === 0 ? (
                          <span className="free-shipping">Miễn phí</span>
                        ) : (
                          formatPrice(orderDetail.orderDetails.shippingFee)
                        )
                      ) : (
                        <span className="free-shipping">Miễn phí</span>
                      )}
                    </span>
                  </div>

                  {/* Hiển thị voucher discount nếu có */}
                  {orderDetail.voucher &&
                    orderDetail.orderDetails?.voucherDiscount > 0 && (
                      <div className="summary-row discount-row">
                        <span>
                          <i className="fas fa-ticket-alt"></i>
                          Voucher ({orderDetail.voucher.code}) -
                          {orderDetail.voucher.discountPercent}%:
                        </span>
                        <span className="discount-amount">
                          -
                          {formatPrice(
                            orderDetail.orderDetails.voucherDiscount
                          )}
                        </span>
                      </div>
                    )}

                  {/* Hiển thị tổng tạm tính nếu có discount
                  {orderDetail.orderDetails?.voucherDiscount > 0 && (
                    <div className="summary-row subtotal-row">
                      <span>Tạm tính:</span>
                      <span>
                        {formatPrice(
                          orderDetail.orderDetails.totalBeforeDiscount
                        )}
                      </span>
                    </div>
                  )} */}

                  <div className="summary-row total">
                    <span>Tổng thanh toán:</span>
                    <span className="total-amount">
                      {formatPrice(orderDetail.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Voucher info nếu có */}
                {orderDetail.voucher && (
                  <div className="voucher-info">
                    <div className="voucher-card">
                      <div className="voucher-icon">
                        <i className="fas fa-ticket-alt"></i>
                      </div>
                      <div className="voucher-details">
                        <div className="voucher-code">
                          Đã áp dụng mã:{" "}
                          <strong>{orderDetail.voucher.code}</strong>
                        </div>
                        <div className="voucher-discount">
                          Giảm {orderDetail.voucher.discountPercent}%
                          {orderDetail.voucher.minOrderValue > 0 &&
                            ` (Đơn tối thiểu ${formatPrice(
                              orderDetail.voucher.minOrderValue
                            )})`}
                        </div>
                        <div className="voucher-saved">
                          Bạn đã tiết kiệm:{" "}
                          <span className="saved-amount">
                            {formatPrice(
                              orderDetail.orderDetails?.voucherDiscount || 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i>
            Đóng
          </button>
          {orderDetail && (
            <button
              className="btn-primary"
              onClick={() => {
                // Có thể thêm chức năng in đơn hàng hoặc tải về
                window.print();
              }}
            >
              <i className="fas fa-print"></i>
              In đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
