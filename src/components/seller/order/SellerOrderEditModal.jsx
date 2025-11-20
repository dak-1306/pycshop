import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderService from "../../../services/orderService";
import { useToast } from "../../../hooks/useToast";

const SellerOrderEditModal = ({ isOpen, onClose, order, onSave }) => {
  const [formData, setFormData] = useState({
    status: "pending",
    notes: "",
    shippingAddress: "",
    trackingNumber: "",
    estimatedDelivery: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestId, setLastRequestId] = useState(null);
  const { showSuccess, showError } = useToast();

  // Populate form when order changes
  useEffect(() => {
    if (order && isOpen) {
      setFormData({
        status: order.status || "pending",
        notes: order.notes || "",
        shippingAddress: order.shippingAddress || "",
        trackingNumber: order.trackingNumber || "",
        estimatedDelivery: order.estimatedDelivery || "",
      });
    }
  }, [order, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.status) {
      showError("Vui lòng chọn trạng thái đơn hàng!");
      return;
    }

    // Prevent duplicate requests in StrictMode
    const requestId = `${Date.now()}-${Math.random()}`;
    console.log(
      `[MODAL] Request ID: ${requestId}, isLoading: ${isLoading}, lastRequestId: ${lastRequestId}`
    );

    if (isLoading) {
      console.log("[MODAL] Request blocked - already loading");
      return;
    }

    setIsLoading(true);
    setLastRequestId(requestId);
    console.log(
      `[MODAL] Starting request for order ${
        order.orderId || order.id || order.ID_DonHang
      } with status ${formData.status}`
    );

    try {
      const orderId = order.orderId || order.id || order.ID_DonHang;

      console.log(
        `[MODAL] Updating order ${orderId} status to ${formData.status}`
      );

      // Call OrderService to update status
      const response = await OrderService.updateOrderStatus(
        orderId,
        formData.status
      );

      if (response.success) {
        showSuccess(`Đã cập nhật trạng thái đơn hàng #${orderId} thành công!`);

        // Call parent onSave callback if provided
        if (onSave) {
          await onSave({
            orderId: orderId,
            ...formData,
          });
        }

        onClose();
      } else {
        throw new Error(
          response.message || "Không thể cập nhật trạng thái đơn hàng"
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showError(error.message || "Lỗi khi cập nhật đơn hàng");
    } finally {
      setIsLoading(false);
      setLastRequestId(null);
    }
  };

  // Order status options for seller (matching backend logic)
  const statusOptions = [
    {
      value: "pending",
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "shipped",
      label: "Đang giao hàng",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "delivered",
      label: "Đã giao hàng",
      color: "bg-green-100 text-green-800",
    },
    { value: "cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800" },
  ];

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white px-6 py-4 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={["fas", "edit"]} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Chỉnh sửa đơn hàng #{order.id || order.ID_DonHang}
                </h2>
                <p className="text-white/90 text-xs">
                  Cập nhật thông tin xử lý đơn hàng
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={["fas", "times"]} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Order Info (Read Only) - Compact */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={["fas", "info-circle"]}
                  className="text-blue-500 w-4 h-4"
                />
                Thông tin đơn hàng
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Khách hàng:</span>
                  <p className="text-gray-900 truncate">
                    {order.buyerName || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tổng tiền:</span>
                  <p className="text-gray-900 font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount || 0)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Điện thoại:</span>
                  <p className="text-gray-900">{order.buyerPhone || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ngày đặt:</span>
                  <p className="text-gray-900">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Editable Fields - Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "flag"]}
                      className="mr-2 text-orange-500 w-4 h-4"
                    />
                    Trạng thái đơn hàng *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.slice(0, 4).map((option) => (
                      <label
                        key={option.value}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={formData.status === option.value}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div
                          className={`
                          px-3 py-2 rounded-lg border-2 transition-all text-center
                          peer-checked:border-orange-500 peer-checked:bg-orange-50
                          hover:border-gray-300 border-gray-200
                          ${
                            formData.status === option.value
                              ? "ring-1 ring-orange-200"
                              : ""
                          }
                        `}
                        >
                          <div
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${option.color}`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {/* Additional status options in second row */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {statusOptions.slice(4).map((option) => (
                      <label
                        key={option.value}
                        className="relative cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={formData.status === option.value}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div
                          className={`
                          px-3 py-2 rounded-lg border-2 transition-all text-center
                          peer-checked:border-orange-500 peer-checked:bg-orange-50
                          hover:border-gray-300 border-gray-200
                          ${
                            formData.status === option.value
                              ? "ring-1 ring-orange-200"
                              : ""
                          }
                        `}
                        >
                          <div
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${option.color}`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "truck"]}
                      className="mr-2 text-orange-500 w-4 h-4"
                    />
                    Mã vận đơn
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                    placeholder="Nhập mã vận đơn..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Shipping Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "map-marker-alt"]}
                      className="mr-2 text-orange-500 w-4 h-4"
                    />
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="Cập nhật địa chỉ giao hàng..."
                  />
                </div>

                {/* Estimated Delivery */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "calendar-check"]}
                      className="mr-2 text-orange-500 w-4 h-4"
                    />
                    Ngày giao hàng dự kiến
                  </label>
                  <input
                    type="date"
                    name="estimatedDelivery"
                    value={formData.estimatedDelivery}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "sticky-note"]}
                      className="mr-2 text-orange-500 w-4 h-4"
                    />
                    Ghi chú xử lý
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="Thêm ghi chú về quá trình xử lý..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons - Fixed Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={["fas", "save"]} className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderEditModal;
