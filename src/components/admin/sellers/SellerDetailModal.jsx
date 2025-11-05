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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Chi tiết Seller
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin cá nhân */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin cá nhân
              </h4>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-xl font-medium text-white">
                        {seller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">
                      {seller.name}
                    </div>
                    <div className="text-sm text-gray-500">ID: {seller.id}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {seller.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Điện thoại
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {seller.phone}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Địa chỉ
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {seller.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Ngày tham gia
                      </label>
                      <div className="mt-1 text-sm text-gray-900">
                        {formatDate(seller.joinDate)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Hoạt động cuối
                      </label>
                      <div className="mt-1 text-sm text-gray-900">
                        {formatDate(seller.lastActive)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Trạng thái
                      </label>
                      <span
                        className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          seller.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seller.status === "active" ? "Hoạt động" : "Bị chặn"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Xác minh
                      </label>
                      <span
                        className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
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
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin Shop
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tên shop
                  </label>
                  <div className="mt-1 text-lg font-medium text-gray-900">
                    {seller.shop.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Danh mục
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {seller.shop.category}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Tổng sản phẩm
                    </label>
                    <div className="mt-1 text-lg font-semibold text-blue-600">
                      {seller.shop.totalProducts.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Tổng đơn hàng
                    </label>
                    <div className="mt-1 text-lg font-semibold text-green-600">
                      {seller.shop.totalOrders.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Đánh giá
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="text-lg font-semibold text-yellow-600">
                        {seller.shop.rating}
                      </span>
                      <span className="text-yellow-400 ml-1">★</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Doanh thu
                    </label>
                    <div className="mt-1 text-lg font-semibold text-purple-600">
                      {formatCurrency(seller.shop.revenue)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiệu suất */}
            <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Hiệu suất kinh doanh
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {seller.performance.orderCompletionRate}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Tỷ lệ hoàn thành đơn hàng
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {seller.performance.responseTime}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Thời gian phản hồi trung bình
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {seller.performance.customerRating}★
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Đánh giá từ khách hàng
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {seller.performance.refundRate}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Tỷ lệ hoàn trả
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailModal;
