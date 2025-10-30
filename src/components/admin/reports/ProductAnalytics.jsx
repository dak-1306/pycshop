import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";

const ProductAnalytics = ({ data = {} }) => {
  const formatNumber = (num) => {
    if (typeof num !== "number") {
      const numValue = Number(num);
      if (isNaN(numValue)) return "0";
      num = numValue;
    }
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          🛍️ Thống kê sản phẩm
        </h3>
        <p className="text-sm text-gray-600">
          Phân tích tình trạng và hiệu quả sản phẩm
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-600 mb-1">
            Tổng sản phẩm
          </p>
          <p className="text-xl font-bold text-blue-900">
            {formatNumber(data.totalProducts)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs font-medium text-green-600 mb-1">Đang bán</p>
          <p className="text-xl font-bold text-green-900">
            {formatNumber(data.activeProducts)}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-xs font-medium text-red-600 mb-1">Hết hàng</p>
          <p className="text-xl font-bold text-red-900">
            {formatNumber(data.outOfStockProducts)}
          </p>
        </div>
      </div>

      {/* Products by Category */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Sản phẩm theo danh mục
        </h4>
        <div className="space-y-2">
          {data.productsByCategory.slice(0, 5).map((category, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
            >
              <span className="text-sm text-gray-600">{category.category}</span>
              <span className="font-medium text-gray-900">
                {formatNumber(category.count)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Top sản phẩm bán chạy
        </h4>
        <div className="space-y-3">
          {data.topSellingProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-32">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Đã bán: {formatNumber(product.sold)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-sm">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
          ⚠️ Cảnh báo tồn kho thấp
        </h4>
        <div className="space-y-2">
          {data.lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div>
                <p className="font-medium text-gray-900 truncate max-w-40">
                  {product.name}
                </p>
                <p className="text-sm text-orange-600">ID: {product.id}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    product.stock === 0
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {product.stock === 0 ? "Hết hàng" : `Còn ${product.stock}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ProductAnalytics.propTypes = {
  data: PropTypes.shape({
    topProducts: PropTypes.array,
    categoryPerformance: PropTypes.array,
    inventoryStatus: PropTypes.object,
    productTrends: PropTypes.array,
  }),
};

export default React.memo(ProductAnalytics);
