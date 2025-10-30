import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";

const AdminStatsCards = ({ stats = {} }) => {
  // Memoize stats configuration to prevent recreation on re-renders
  const statsConfig = useMemo(
    () => [
      {
        key: "totalUsers",
        title: "Tổng người dùng",
        unit: "",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-100",
        textColor: "text-blue-600",
        valueColor: "text-blue-700",
        unitColor: "text-blue-500",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        value: stats?.totalUsers || 0,
        change: `+${stats?.todayUsers || 0} hôm nay`,
        changeColor: "text-green-600",
        icon: (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        ),
      },
      {
        key: "totalOrders",
        title: "Tổng đơn hàng",
        unit: "",
        bgColor: "bg-green-50",
        borderColor: "border-green-100",
        textColor: "text-green-600",
        valueColor: "text-green-700",
        unitColor: "text-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        value: stats?.totalOrders || 0,
        change: `+${stats?.todayOrders || 0} hôm nay`,
        changeColor: "text-green-600",
        icon: (
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        ),
      },
      {
        key: "totalProducts",
        title: "Tổng sản phẩm",
        unit: "",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-100",
        textColor: "text-purple-600",
        valueColor: "text-purple-700",
        unitColor: "text-purple-500",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        value: stats?.totalProducts || 0,
        change: "Đang hoạt động",
        changeColor: "text-blue-600",
        icon: (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
      },
      {
        key: "totalRevenue",
        title: "Tổng doanh thu",
        unit: "",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-100",
        textColor: "text-orange-600",
        valueColor: "text-orange-700",
        unitColor: "text-orange-500",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        value: stats?.totalRevenue || 0,
        change: `+${stats?.monthlyGrowth || 0}% tháng này`,
        changeColor: "text-green-600",
        isRevenue: true,
        icon: (
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        ),
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((config) => (
        <div
          key={config.key}
          className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${config.borderColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${config.textColor}`}>
                {config.title}
              </p>
              <p className={`text-3xl font-bold ${config.valueColor} mt-2`}>
                {config.isRevenue
                  ? formatCurrency(config.value)
                  : config.value.toLocaleString()}
                {config.unit && (
                  <span className={`${config.unitColor} text-xs ml-1`}>
                    {config.unit}
                  </span>
                )}
              </p>
              <p
                className={`text-sm mt-2 flex items-center ${config.changeColor}`}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {config.change}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${config.iconBg} rounded-lg flex items-center justify-center`}
            >
              <div className={config.iconColor}>{config.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

AdminStatsCards.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number,
    todayUsers: PropTypes.number,
    totalOrders: PropTypes.number,
    todayOrders: PropTypes.number,
    totalProducts: PropTypes.number,
    totalRevenue: PropTypes.number,
    monthlyGrowth: PropTypes.number,
  }),
};

export default React.memo(AdminStatsCards);
