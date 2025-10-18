import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
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
    const { t } = useLanguage();

    // Defensive check for products array
    const safeProducts = Array.isArray(products) ? products : [];

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price || 0);
    };

    // Show empty state if no products
    if (safeProducts.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FontAwesomeIcon
            icon={["fas", "box-open"]}
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("noProducts")}
          </h3>
          <p className="text-gray-500">{t("noProductsDescription")}</p>
        </div>
      );
    }

    const getStockColor = (stock) => {
      if (stock > 10) return "text-green-600";
      if (stock > 0) return "text-yellow-600";
      return "text-red-600";
    };

    const getStatusColorInternal = (status) => {
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
          return t("inStock");
        case "out_of_stock":
          return t("outOfStock");
        case "pending":
          return t("pending");
        case "inactive":
          return t("stopSelling");
        default:
          return t("undefined");
      }
    };

    if (variant === "admin") {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("image")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("productName")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("seller")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("price")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("stock")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("category")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("createdAt")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeProducts.map((product, index) => (
                <tr
                  key={
                    product.id ||
                    product._id ||
                    product.sku ||
                    `admin-product-${index}`
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={["fas", "image"]}
                          className="w-full h-full text-gray-300"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.description?.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.sellerName || product.seller}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-semibold ${getStockColor(
                        product.stock
                      )}`}
                    >
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColorInternal(
                        product.status
                      )}`}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(
                      product.createdAt || product.dateAdded
                    ).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          onViewProduct && onViewProduct(product.id)
                        }
                        className="group flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-600"
                        title="Xem chi tiết"
                        aria-label={`Xem chi tiết sản phẩm ${product.name}`}
                      >
                        <FontAwesomeIcon
                          icon={["fas", "eye"]}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">Xem</span>
                      </button>{" "}
                      <button
                        onClick={() =>
                          onEditProduct && onEditProduct(product.id)
                        }
                        className="group flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg transition-all duration-200 border border-indigo-200 hover:border-indigo-600"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa sản phẩm ${product.name}`}
                      >
                        <FontAwesomeIcon
                          icon={["fas", "edit"]}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">{t("edit")}</span>
                      </button>
                      <button
                        onClick={() =>
                          onDeleteProduct && onDeleteProduct(product.id)
                        }
                        className="group flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-600"
                        title="Xóa sản phẩm"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "trash"]}
                          className="w-4 h-4"
                        />
                        <span className="text-xs">{t("delete")}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Seller variant (default)
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border overflow-x-auto">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 border-b">
          {" "}
          <h3 className="text-lg font-semibold text-gray-800">
            {t("productList")}
          </h3>
        </div>
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("image")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("productName")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("price")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("quantity")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("category")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeProducts.map((product, index) => (
              <tr
                key={
                  product.id ||
                  product._id ||
                  product.sku ||
                  `seller-product-${index}`
                }
                className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md transform hover:-translate-y-0.5 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={["fas", "image"]}
                        className="w-10 h-10 text-gray-300"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div
                    className={`text-lg font-bold ${getStockColor(
                      product.quantity
                    )}`}
                  >
                    {product.quantity}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full ${getStatusColorInternal(
                      product.status
                    )}`}
                  >
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {" "}
                    <button
                      onClick={() => onViewProduct && onViewProduct(product.id)}
                      className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "eye"]}
                        className="w-4 h-4"
                      />
                      <span>{t("view")}</span>
                    </button>
                    <button
                      onClick={() => onEditProduct && onEditProduct(product.id)}
                      className="group flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "edit"]}
                        className="w-4 h-4"
                      />
                      <span>{t("edit")}</span>
                    </button>
                    <button
                      onClick={() =>
                        onDeleteProduct && onDeleteProduct(product.id)
                      }
                      className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "trash"]}
                        className="w-4 h-4"
                      />
                      <span>{t("delete")}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
