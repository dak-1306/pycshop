import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../common/dashboard/charts/chartUtils";

const SystemPerformanceMetrics = ({ data = {} }) => {
  // Default metrics if no data provided
  const {
    totalRevenue = 28456000000,
    revenueGrowth = 12.5,
    totalOrders = 8560,
    orderGrowth = 8.3,
    averageOrderValue = 3325000,
    conversionRate = 2.8,
  } = data;

  const metrics = useMemo(
    () => [
      {
        id: "revenue",
        label: "Tổng doanh thu",
        value: formatCurrency(totalRevenue),
        growth: revenueGrowth,
        icon: (
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        ),
      },
      {
        id: "orders",
        label: "Tổng đơn hàng",
        value: totalOrders.toLocaleString("vi-VN"),
        growth: orderGrowth,
        icon: (
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        ),
      },
      {
        id: "aov",
        label: "Giá trị đơn hàng TB",
        value: formatCurrency(averageOrderValue),
        growth: 5.2,
        icon: (
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        id: "conversion",
        label: "Tỷ lệ chuyển đổi",
        value: `${conversionRate}%`,
        growth: 0.3,
        icon: (
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        ),
      },
    ],
    [
      totalRevenue,
      revenueGrowth,
      totalOrders,
      orderGrowth,
      averageOrderValue,
      conversionRate,
    ]
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Hiệu suất hệ thống
        </h3>
        <span className="text-sm text-gray-500">Tháng này</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="relative">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">{metric.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </p>
                <div className="flex items-center mt-2">
                  <div
                    className={`flex items-center ${
                      metric.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.growth >= 0 ? (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.growth)}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    so với tháng trước
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SystemPerformanceMetrics.propTypes = {
  data: PropTypes.shape({
    totalRevenue: PropTypes.number,
    revenueGrowth: PropTypes.number,
    totalOrders: PropTypes.number,
    orderGrowth: PropTypes.number,
    averageOrderValue: PropTypes.number,
    conversionRate: PropTypes.number,
  }),
};

export default React.memo(SystemPerformanceMetrics);
