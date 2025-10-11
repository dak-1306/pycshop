import React from "react";

const StatsCards = ({ stats, variant = "seller" }) => {
  // Admin stats configuration
  const adminStatsConfig = [
    {
      key: "totalUsers",
      title: "Tổng người dùng",
      unit: "người",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      textColor: "text-blue-600",
      valueColor: "text-blue-700",
      unitColor: "text-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      key: "totalOrders",
      title: "Tổng đơn hàng",
      unit: "đơn",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
      textColor: "text-orange-600",
      valueColor: "text-orange-700",
      unitColor: "text-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a1 1 0 110-2h4zm2-1v1h2V3H9zm5 5a1 1 0 10-2 0v2a1 1 0 102 0V8zm-4 0a1 1 0 10-2 0v2a1 1 0 102 0V8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      key: "totalRevenue",
      title: "Tổng doanh thu",
      unit: "₫",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      textColor: "text-green-600",
      valueColor: "text-green-700",
      unitColor: "text-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      key: "totalProducts",
      title: "Tổng sản phẩm",
      unit: "sản phẩm",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      textColor: "text-purple-600",
      valueColor: "text-purple-700",
      unitColor: "text-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  // Seller stats configuration
  const sellerStatsConfig = [
    {
      key: "orders",
      title: "Đơn hàng",
      unit: "đơn",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
      textColor: "text-orange-600",
      valueColor: "text-orange-700",
      unitColor: "text-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a1 1 0 110-2h4zm2-1v1h2V3H9zm5 5a1 1 0 10-2 0v2a1 1 0 102 0V8zm-4 0a1 1 0 10-2 0v2a1 1 0 102 0V8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      key: "revenue",
      title: "Doanh thu hôm nay",
      unit: "₫",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      textColor: "text-green-600",
      valueColor: "text-green-700",
      unitColor: "text-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      key: "products",
      title: "Sản phẩm đang bán",
      unit: "sản phẩm",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      textColor: "text-blue-600",
      valueColor: "text-blue-700",
      unitColor: "text-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      key: "customers",
      title: "Khách hàng mới",
      unit: "khách hàng",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      textColor: "text-purple-600",
      valueColor: "text-purple-700",
      unitColor: "text-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
  ];

  const statsConfig =
    variant === "admin" ? adminStatsConfig : sellerStatsConfig;

  const formatValue = (value, key) => {
    if (key === "revenue" || key === "totalRevenue") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value || 0);
    }
    return (value || 0).toLocaleString("vi-VN");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((config) => (
        <div
          key={config.key}
          className={`relative overflow-hidden rounded-2xl ${config.bgColor} ${config.borderColor} border-2 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10 transform rotate-12 translate-x-6 -translate-y-6">
            <div
              className={`w-full h-full ${config.iconBg} rounded-full`}
            ></div>
          </div>

          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-12 h-12 ${config.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <div className={config.iconColor}>{config.icon}</div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3
              className={`text-sm font-semibold ${config.textColor} mb-2 group-hover:text-opacity-80 transition-colors`}
            >
              {config.title}
            </h3>
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-2xl font-bold ${config.valueColor} group-hover:scale-105 transition-transform duration-300 inline-block`}
              >
                {config.key === "revenue" || config.key === "totalRevenue"
                  ? formatValue(stats?.[config.key], config.key).replace(
                      "₫",
                      ""
                    )
                  : formatValue(stats?.[config.key], config.key)}
              </span>
              <span className={`text-sm font-medium ${config.unitColor}`}>
                {config.unit}
              </span>
            </div>

            {/* Trend indicator (optional) */}
            {stats?.[`${config.key}Trend`] && (
              <div
                className={`mt-2 flex items-center text-xs ${
                  stats[`${config.key}Trend`] > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d={
                      stats[`${config.key}Trend`] > 0
                        ? "M12 7l-4 4-4-4h8z"
                        : "M8 13l4-4 4 4H8z"
                    }
                    clipRule="evenodd"
                  />
                </svg>
                {Math.abs(stats[`${config.key}Trend`])}% so với tháng trước
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
