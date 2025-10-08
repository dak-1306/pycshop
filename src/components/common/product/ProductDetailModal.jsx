import React from "react";

const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onDelete }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Chi tiết sản phẩm</h2>
                <p className="text-blue-100 text-sm">
                  Xem thông tin chi tiết sản phẩm
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
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
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-24 h-24 text-gray-400 mx-auto mb-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        Chưa có hình ảnh
                      </p>
                      <p className="text-gray-400 text-sm">
                        Hãy thêm hình ảnh để sản phẩm hấp dẫn hơn
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600 font-medium min-w-[120px]">
                      Tên sản phẩm:
                    </span>
                    <span className="text-gray-800 font-semibold text-right flex-1">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Danh mục:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Inventory */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Giá & Kho hàng
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Giá bán:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {product.price}₫
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Số lượng tồn:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-800">
                        {product.quantity}
                      </span>
                      <span className="text-gray-500">sản phẩm</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Trạng thái:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "out_of_stock"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status === "active"
                        ? "Còn hàng"
                        : product.status === "out_of_stock"
                        ? "Hết hàng"
                        : "Ngừng bán"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Thông tin bổ sung
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 font-medium block mb-2">
                      Mô tả sản phẩm:
                    </span>
                    <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                      <p className="text-gray-700 leading-relaxed">
                        {product.description ||
                          "Chưa có mô tả cho sản phẩm này. Hãy thêm mô tả để khách hàng hiểu rõ hơn về sản phẩm."}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        #{product.id}
                      </div>
                      <div className="text-sm text-gray-500">Mã sản phẩm</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {product.quantity > 0 ? "✅" : "❌"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tình trạng kho
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Hành động nhanh
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onEdit && onEdit(product.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Chỉnh sửa</span>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
