import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";

const FinancialReports = ({ data = {} }) => {
  const formatPercentage = (percentage) => {
    if (typeof percentage !== "number") return "0.0%";
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          💰 Báo cáo tài chính
        </h3>
        <p className="text-sm text-gray-600">
          Phân tích doanh thu và hiệu quả kinh doanh
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600 mb-1">
            Doanh thu tháng này
          </p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(data.revenueThisMonth || 0)}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-600 mb-1">Tăng trưởng</p>
          <p
            className={`text-2xl font-bold ${
              (data.revenueGrowth || 0) > 0 ? "text-green-900" : "text-red-900"
            }`}
          >
            {formatPercentage(data.revenueGrowth || 0)}
          </p>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Xu hướng doanh thu 4 tháng gần đây
        </h4>
        <div className="space-y-3">
          {Array.isArray(data.revenueChart) &&
            data.revenueChart.map((item, index) => {
              const maxRevenue = Math.max(
                ...data.revenueChart.map((i) => i?.revenue || 0)
              );
              const percentage =
                maxRevenue > 0 ? ((item?.revenue || 0) / maxRevenue) * 100 : 0;

              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      Tháng {item.month.split("-")[1]}/
                      {item.month.split("-")[0]}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Doanh thu theo danh mục
        </h4>
        <div className="space-y-3">
          {Array.isArray(data.revenueByCategory) &&
            data.revenueByCategory.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-yellow-600">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {category?.category || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category?.percentage || 0}% tổng doanh thu
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {formatCurrency(category?.revenue || 0)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">💎</span>
            </div>
            <div>
              <p className="font-semibold text-green-900">
                Tổng doanh thu tích lũy
              </p>
              <p className="text-sm text-green-700">Từ khi ra mắt hệ thống</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(data.totalRevenue || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialReports.propTypes = {
  data: PropTypes.shape({
    revenueThisMonth: PropTypes.number,
    revenueGrowth: PropTypes.number,
    totalRevenue: PropTypes.number,
    revenueChart: PropTypes.arrayOf(
      PropTypes.shape({
        revenue: PropTypes.number,
        month: PropTypes.string,
      })
    ),
    revenueByCategory: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string,
        revenue: PropTypes.number,
        percentage: PropTypes.number,
      })
    ),
  }),
};

export default React.memo(FinancialReports);
