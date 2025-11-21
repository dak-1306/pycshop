import React, { useState } from "react";
import { useToast } from "../../../hooks/useToast";

const OrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  const loadOrderDetail = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with actual API call
      const mockOrder = {
        id: orderId,
        orderNumber: `ORD${orderId.toString().padStart(6, "0")}`,
        status: "processing",
        totalAmount: 750000,
        createdAt: new Date().toISOString(),
        customer: {
          name: "Nguyễn Văn A",
          email: "customer@example.com",
          phone: "0901234567",
        },
        shippingAddress: {
          fullName: "Nguyễn Văn A",
          phone: "0901234567",
          address: "123 Đường ABC, Quận 1, TP.HCM",
        },
        items: [
          {
            id: 1,
            name: "Laptop Gaming",
            price: 25000000,
            quantity: 1,
            image: "/images/products/laptop.jpg",
          },
          {
            id: 2,
            name: "Chuột gaming",
            price: 500000,
            quantity: 1,
            image: "/images/products/mouse.jpg",
          },
        ],
        timeline: [
          {
            status: "pending",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            description: "Đơn hàng được tạo",
          },
          {
            status: "confirmed",
            timestamp: new Date(Date.now() - 43200000).toISOString(),
            description: "Đã xác nhận đơn hàng",
          },
          {
            status: "processing",
            timestamp: new Date().toISOString(),
            description: "Đang chuẩn bị hàng",
          },
        ],
      };

      setOrderDetail(mockOrder);
    } catch (err) {
      setError("Không thể tải thông tin đơn hàng");
      showError("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetail();
    }
  }, [isOpen, orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
      processing: {
        label: "Đang xử lý",
        color: "bg-orange-100 text-orange-800",
      },
      shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Chi tiết đơn hàng
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <i className="fas fa-exclamation-circle text-2xl text-red-400 mb-2"></i>
              <p className="text-red-500">{error}</p>
            </div>
          ) : orderDetail ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="ml-2 font-medium">
                        {orderDetail.orderNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          getStatusInfo(orderDetail.status).color
                        }`}
                      >
                        {getStatusInfo(orderDetail.status).label}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="ml-2">
                        {new Date(orderDetail.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="ml-2 font-semibold text-orange-600">
                        {formatPrice(orderDetail.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="ml-2">{orderDetail.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2">{orderDetail.customer.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="ml-2">{orderDetail.customer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Địa chỉ giao hàng
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">
                    {orderDetail.shippingAddress.fullName}
                  </div>
                  <div className="text-gray-600">
                    {orderDetail.shippingAddress.phone}
                  </div>
                  <div className="text-gray-600">
                    {orderDetail.shippingAddress.address}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Sản phẩm đặt hàng
                </h3>
                <div className="space-y-3">
                  {orderDetail.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <div className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Thành tiền: {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Lịch sử đơn hàng
                </h3>
                <div className="space-y-3">
                  {orderDetail.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {getStatusInfo(event.status).label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.description}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(event.timestamp).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
