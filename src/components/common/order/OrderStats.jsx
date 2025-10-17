import React from "react";
import PropTypes from "prop-types";

const OrderStats = ({ stats = {} }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const statsConfig = [
    {
      key: "totalOrders",
      title: "Tổng đơn hàng",
      value: stats?.totalOrders || 856,
      bgColor: "bg-white",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
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
      key: "pendingOrders",
      title: "Chờ xử lý",
      value: stats?.pendingOrders || 23,
      bgColor: "bg-white",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      key: "completedOrders",
      title: "Hoàn thành",
      value: stats?.completedOrders || 789,
      bgColor: "bg-white",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      key: "totalRevenue",
      title: "Tổng doanh thu",
      value: stats?.totalRevenue || 285460000,
      isRevenue: true,
      bgColor: "bg-white",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {statsConfig.map((config) => (
        <div
          key={config.key}
          className={`${config.bgColor} p-6 rounded-lg shadow`}
        >
          <div className="flex items-center">
            <div
              className={`w-12 h-12 ${config.iconBg} rounded-lg flex items-center justify-center mr-4`}
            >
              <div className={config.iconColor}>{config.icon}</div>
            </div>
            <div>
              <p className={`text-2xl font-bold ${config.textColor}`}>
                {config.isRevenue
                  ? formatCurrency(config.value)
                  : (Number(config.value) || 0).toLocaleString()}
              </p>
              <p className={`text-sm ${config.subTextColor}`}>{config.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

OrderStats.propTypes = {
  stats: PropTypes.shape({
    totalOrders: PropTypes.number,
    pendingOrders: PropTypes.number,
    completedOrders: PropTypes.number,
    totalRevenue: PropTypes.number,
  }),
};

export default OrderStats;
