import React, { useEffect } from "react";

const SellerDetailModal = ({
  isOpen,
  seller,
  onClose,
  formatCurrency,
  formatDate,
}) => {
  // Handle ESC key
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !seller) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết Seller
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - No scroll */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
            {/* Thông tin cá nhân */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Thông tin cá nhân
              </h4>

              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {seller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {seller.name}
                    </div>
                    <div className="text-xs text-gray-500">ID: {seller.id}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Email
                    </label>
                    <div className="text-xs text-gray-900 truncate">
                      {seller.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Điện thoại
                    </label>
                    <div className="text-xs text-gray-900">{seller.phone}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Địa chỉ
                    </label>
                    <div className="text-xs text-gray-900 truncate">
                      {seller.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Tham gia:</span>
                      <span className="text-xs text-gray-900">
                        {formatDate(seller.joinDate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Hoạt động:</span>
                      <span className="text-xs text-gray-900">
                        {formatDate(seller.lastActive)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Trạng thái:</span>
                      <span
                        className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${
                          seller.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seller.status === "active" ? "Hoạt động" : "Bị chặn"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Xác minh:</span>
                      <span
                        className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${
                          seller.isVerified
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {seller.isVerified ? "Đã xác minh" : "Chờ xác minh"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin shop */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Thông tin Shop
              </h4>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Tên shop
                  </label>
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {seller.shop.name}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500">
                    Danh mục
                  </label>
                  <div className="text-xs text-gray-900 truncate">
                    {seller.shop.category}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-xs font-semibold text-blue-600">
                      {seller.shop.totalProducts.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Sản phẩm</div>
                  </div>

                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-xs font-semibold text-green-600">
                      {seller.shop.totalOrders.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Đơn hàng</div>
                  </div>

                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-semibold text-yellow-600">
                        {seller.shop.rating}
                      </span>
                      <span className="text-yellow-400 ml-0.5 text-xs">★</span>
                    </div>
                    <div className="text-xs text-gray-500">Đánh giá</div>
                  </div>

                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-xs font-semibold text-purple-600 truncate">
                      {formatCurrency(seller.shop.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">Doanh thu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiệu suất */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Hiệu suất kinh doanh
              </h4>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-xs font-bold text-green-600">
                    {seller.performance.orderCompletionRate}%
                  </div>
                  <div className="text-xs text-gray-500">Hoàn thành</div>
                </div>

                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-xs font-bold text-blue-600">
                    {seller.performance.responseTime}
                  </div>
                  <div className="text-xs text-gray-500">Phản hồi</div>
                </div>

                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="text-xs font-bold text-yellow-600">
                    {seller.performance.customerRating}★
                  </div>
                  <div className="text-xs text-gray-500">Đánh giá KH</div>
                </div>

                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="text-xs font-bold text-red-600">
                    {seller.performance.refundRate}%
                  </div>
                  <div className="text-xs text-gray-500">Hoàn trả</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailModal;
