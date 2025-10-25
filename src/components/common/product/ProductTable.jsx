import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductTable = React.memo(
  ({
    products = [],
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
    getStatusColor,
    variant = "seller", // "admin" | "seller"
  }) => {
    // Defensive check for products array
    const safeProducts = Array.isArray(products) ? products : [];

    // Show empty state if no products
    if (safeProducts.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <FontAwesomeIcon
            icon={["fas", "box-open"]}
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có sản phẩm
          </h3>
          <p className="text-gray-500">Danh sách sản phẩm sẽ hiển thị ở đây</p>
        </div>
      );
    }

    const getStatusColorInternal = (status) => {
      if (getStatusColor) return getStatusColor(status);

      switch (status) {
        case "active":
        case "hoạt động":
          return "bg-green-100 text-green-800";
        case "inactive":
        case "không hoạt động":
          return "bg-red-100 text-red-800";
        case "pending":
        case "chờ duyệt":
          return "bg-yellow-100 text-yellow-800";
        case "draft":
        case "bản nháp":
          return "bg-gray-100 text-gray-800";
        case "out_of_stock":
        case "hết hàng":
          return "bg-orange-100 text-orange-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "active":
        case "hoạt động":
          return "Hoạt động";
        case "inactive":
        case "không hoạt động":
          return "Không hoạt động";
        case "pending":
        case "chờ duyệt":
          return "Chờ duyệt";
        case "draft":
        case "bản nháp":
          return "Bản nháp";
        case "out_of_stock":
        case "hết hàng":
          return "Hết hàng";
        default:
          return "Không xác định";
      }
    };

    const getCategoryText = (category) => {
      if (!category) return "Chưa phân loại";
      return typeof category === "string"
        ? category
        : category.name || "Chưa phân loại";
    };

    const getProductImage = (product) => {
      // Handle different image property formats
      if (product.image) return product.image;
      if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        return product.images[0];
      }
      if (product.HinhAnh) return product.HinhAnh;
      return "/images/placeholder-product.png";
    };

    // Unified admin-style table with conditional column display
    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                {variant === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người bán
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeProducts.map((product, index) => (
                <tr
                  key={product.id || product.ID_SanPham || `product-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover border"
                          src={getProductImage(product)}
                          alt={product.name || product.TenSanPham || "Product"}
                          onError={(e) => {
                            e.target.src = "/images/placeholder-product.png";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {product.name || product.TenSanPham}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{product.id || product.ID_SanPham}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getCategoryText(product.category || product.DanhMuc)}
                    </div>
                  </td>
                  {variant === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.sellerName ||
                          product.seller ||
                          product.TenCuaHang ||
                          "Shop"}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.price || product.Gia)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(product.stock !== undefined
                        ? product.stock
                        : product.SoLuongTon) || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorInternal(
                        product.status || product.TrangThai
                      )}`}
                    >
                      {getStatusText(product.status || product.TrangThai)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.createdAt || product.NgayTao
                      ? new Date(
                          product.createdAt || product.NgayTao
                        ).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          onViewProduct &&
                          onViewProduct(product.id || product.ID_SanPham)
                        }
                        className="group flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-600"
                        title="Xem chi tiết sản phẩm"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "eye"]}
                          className="w-3.5 h-3.5"
                        />
                        <span className="text-xs">Xem</span>
                      </button>

                      <button
                        onClick={() =>
                          onEditProduct &&
                          onEditProduct(product.id || product.ID_SanPham)
                        }
                        className="group flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 border border-indigo-200 hover:border-indigo-600"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "edit"]}
                          className="w-3.5 h-3.5"
                        />
                        <span className="text-xs">Sửa</span>
                      </button>

                      {variant === "admin" && (
                        <button
                          onClick={() =>
                            onDeleteProduct &&
                            onDeleteProduct(product.id || product.ID_SanPham)
                          }
                          className="group flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-600"
                          title="Xóa sản phẩm"
                        >
                          <FontAwesomeIcon
                            icon={["fas", "trash"]}
                            className="w-3.5 h-3.5"
                          />
                          <span className="text-xs">Xóa</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ProductTable.displayName = "ProductTable";

ProductTable.propTypes = {
  products: PropTypes.array,
  onViewProduct: PropTypes.func,
  onEditProduct: PropTypes.func,
  onDeleteProduct: PropTypes.func,
  getStatusColor: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default ProductTable;
