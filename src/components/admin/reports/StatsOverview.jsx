import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../common/dashboard/charts/chartUtils";

const StatsOverview = ({ stats = {} }) => {
  const formatNumber = (num) => {
    if (typeof num !== "number") {
      const numValue = Number(num);
      if (isNaN(numValue)) return "0";
      num = numValue;
    }
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const statsCards = useMemo(
    () => [
      {
        title: "Tổng người dùng",
        value: formatNumber(stats.totalUsers || 0),
        icon: "👥",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Tổng đơn hàng",
        value: formatNumber(stats.totalOrders || 0),
        icon: "📦",
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Tổng sản phẩm",
        value: formatNumber(stats.totalProducts || 0),
        icon: "🛍️",
        color: "from-purple-500 to-purple-600",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Tổng doanh thu",
        value: formatCurrency(stats.totalRevenue || 0),
        icon: "💰",
        color: "from-yellow-500 to-yellow-600",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
      },
      {
        title: "Người dùng hoạt động",
        value: formatNumber(stats.activeUsers || 0),
        icon: "🟢",
        color: "from-emerald-500 to-emerald-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
      },
      {
        title: "Đơn hàng chờ xử lý",
        value: formatNumber(stats.pendingOrders || 0),
        icon: "⏳",
        color: "from-orange-500 to-orange-600",
        bgColor: "bg-orange-50",
        textColor: "text-orange-600",
      },
      {
        title: "Sản phẩm hết hàng",
        value: formatNumber(stats.outOfStockProducts || 0),
        icon: "📉",
        color: "from-red-500 to-red-600",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      },
    ],
    [stats]
  );

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          📊 Tổng quan hệ thống
        </h2>
        <p className="text-gray-600">
          Các chỉ số quan trọng nhất của hệ thống PycShop
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
              >
                <span className="text-xl">{card.icon}</span>
              </div>
            </div>

            <div className="mt-4">
              <div
                className={`w-full h-1 bg-gradient-to-r ${card.color} rounded-full opacity-20`}
              ></div>
              <div
                className={`w-3/4 h-1 bg-gradient-to-r ${card.color} rounded-full -mt-1`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StatsOverview.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number,
    totalOrders: PropTypes.number,
    totalProducts: PropTypes.number,
    totalRevenue: PropTypes.number,
    activeUsers: PropTypes.number,
    pendingOrders: PropTypes.number,
    outOfStockProducts: PropTypes.number,
  }),
};

export default React.memo(StatsOverview);
