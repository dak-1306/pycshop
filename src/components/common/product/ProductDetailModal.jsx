import React from "react";
import PropTypes from "prop-types";
import ProductImageGallery from "./ProductImageGallery";

const ProductDetailModal = React.memo(
  ({ isOpen, onClose, product, onEdit, onDelete }) => {
    if (!isOpen || !product) return null;

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price || 0);
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800";
        case "out_of_stock":
          return "bg-red-100 text-red-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "inactive":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "active":
          return "Còn hàng";
        case "out_of_stock":
          return "Hết hàng";
        case "pending":
          return "Chờ duyệt";
        case "inactive":
          return "Ngừng bán";
        default:
          return "Không xác định";
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết sản phẩm
                </h2>
                <p className="text-gray-500 text-sm">
                  Thông tin chi tiết và hình ảnh sản phẩm
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors group"
            >
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
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

          {/* Content - Scrollable với custom scrollbar */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Product Images */}
                <div className="space-y-6">
                  <ProductImageGallery product={product} />
                </div>

                {/* Right Column - Product Information */}
                <div className="space-y-6">
                  {/* Product Name & Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name || "Tên sản phẩm"}
                      </h1>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusText(product.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ID: #{product.id || product._id}
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-3xl font-bold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                      </div>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Giảm{" "}
                              {Math.round(
                                ((product.originalPrice - product.price) /
                                  product.originalPrice) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">
                          Số lượng
                        </div>
                        <div className="text-xl font-semibold text-gray-900">
                          {product.quantity || product.stock || 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">
                          Danh mục
                        </div>
                        <div className="text-xl font-semibold text-gray-900">
                          {product.category || "Chưa phân loại"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Description */}
                  {product.description && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Mô tả sản phẩm
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Seller Information */}
                  {(product.sellerName || product.seller) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Thông tin người bán
                      </h3>
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(product.sellerName || product.seller || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.sellerName || product.seller}
                            </div>
                            <div className="text-sm text-gray-500">
                              Người bán
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Thông tin khác
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {(product.createdAt || product.dateAdded) && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500">Ngày tạo:</span>
                          <span className="font-medium">
                            {new Date(
                              product.createdAt || product.dateAdded
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                      {product.updatedAt && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500">Cập nhật cuối:</span>
                          <span className="font-medium">
                            {new Date(product.updatedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                      {product.sku && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-500">SKU:</span>
                          <span className="font-medium font-mono">
                            {product.sku}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed */}
          <div className="border-t border-gray-100 p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Đóng
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(product.id || product._id)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  Chỉnh sửa
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(product.id || product._id)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductDetailModal.displayName = "ProductDetailModal";

ProductDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ProductDetailModal;
