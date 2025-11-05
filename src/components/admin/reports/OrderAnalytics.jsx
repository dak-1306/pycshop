import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";

const OrderAnalytics = ({ data = {} }) => {
  const formatNumber = (num) => {
    if (typeof num !== "number") {
      const numValue = Number(num);
      if (isNaN(numValue)) return "0";
      num = numValue;
    }
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const totalOrders = data.ordersByStatus
    ? Object.values(data.ordersByStatus).reduce(
        (sum, count) => sum + (count || 0),
        0
      )
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          📦 Thống kê đơn hàng
        </h3>
        <p className="text-sm text-gray-600">
          Phân tích tình trạng và xu hướng đơn hàng
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-600 mb-1">
            Tổng đơn hàng
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {formatNumber(data.totalOrders)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600 mb-1">
            Giá trị trung bình
          </p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(data.averageOrderValue)}
          </p>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Phân bố theo trạng thái
        </h4>
        <div className="space-y-3">
          {Object.entries(data.ordersByStatus).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({formatNumber(count)})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {((count / totalOrders) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    status === "pending"
                      ? "bg-yellow-500"
                      : status === "confirmed"
                      ? "bg-blue-500"
                      : status === "shipped"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${(count / totalOrders) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Top danh mục bán chạy
        </h4>
        <div className="space-y-3">
          {data.topOrderCategories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {category.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatNumber(category.orders)} đơn hàng
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  {formatCurrency(category.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Orders */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600">📈</span>
          </div>
          <div>
            <p className="font-semibold text-blue-900">
              +{formatNumber(data.ordersThisMonth)} đơn hàng tháng này
            </p>
            <p className="text-sm text-blue-700">
              Tăng trưởng so với tháng trước
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderAnalytics.propTypes = {
  data: PropTypes.shape({
    ordersByStatus: PropTypes.object,
    avgOrderValue: PropTypes.number,
    topCustomers: PropTypes.array,
    recentOrders: PropTypes.array,
  }),
};

export default React.memo(OrderAnalytics);
