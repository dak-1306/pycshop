import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import ProductImageGallery from "./ProductImageGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductDetailModal = React.memo(
  ({ isOpen, onClose, product, onEdit, onDelete }) => {
    // Handle ESC key
    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    useEffect(() => {
      if (isOpen) {
        const handleEsc = (e) => {
          if (e.key === "Escape") {
            handleClose();
          }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
      }
    }, [isOpen, handleClose]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    };

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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col">
          {/* Header - Compact */}
          <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
                <FontAwesomeIcon
                  icon={["fas", "box-open"]}
                  className="w-6 h-6"
                />
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
              <FontAwesomeIcon
                icon={["fas", "times"]}
                className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors"
              />
            </button>
          </div>

          {/* Content - Fixed height layout */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* Left Column - Product Images (5/12) */}
                <div className="lg:col-span-5 space-y-4">
                  <ProductImageGallery product={product} />
                </div>

                {/* Right Column - Product Information (7/12) */}
                <div className="lg:col-span-7 space-y-4 overflow-y-auto pr-2">
                  {/* Product Name & Basic Info - Compact */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {product.name || "Tên sản phẩm"}
                      </h1>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusText(product.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: #{product.id || product._id}
                        </span>
                      </div>
                    </div>

                    {/* Price Section - Compact */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                      </div>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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

                    {/* Product Details - Compact */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          Số lượng
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {product.quantity || product.stock || 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          Danh mục
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {product.category || "Chưa phân loại"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Description - Compact */}
                  {product.description && (
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Mô tả sản phẩm
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Seller Information - Compact */}
                  {(product.sellerName || product.seller) && (
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        Thông tin người bán
                      </h3>
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(product.sellerName || product.seller || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {product.sellerName || product.seller}
                            </div>
                            <div className="text-xs text-gray-500">
                              Người bán
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata - Compact */}
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      Thông tin khác
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                      {(product.createdAt || product.dateAdded) && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Ngày tạo:
                          </span>
                          <span className="text-xs font-medium">
                            {new Date(
                              product.createdAt || product.dateAdded
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                      {product.updatedAt && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Cập nhật cuối:
                          </span>
                          <span className="text-xs font-medium">
                            {new Date(product.updatedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      )}
                      {product.sku && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">SKU:</span>
                          <span className="text-xs font-medium font-mono">
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

          {/* Footer Actions - Compact */}
          <div className="border-t border-gray-100 py-4 px-6">
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
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={["fas", "edit"]} />
                  <span>Chỉnh sửa</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(product.id || product._id)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={["fas", "trash"]} />
                  <span>Xóa</span>
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
