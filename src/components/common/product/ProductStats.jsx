import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const ProductStats = ({ stats }) => {
  const { t } = useLanguage();  const statsConfig = [
    {
      key: "totalProducts",
      title: t("totalProducts"),
      value: stats?.totalProducts || 342,
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),    },
    {
      key: "activeProducts",
      title: t("activeProducts"),
      value: stats?.activeProducts || 298,
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
      ),    },
    {
      key: "outOfStockProducts",
      title: t("outOfStock"),
      value: stats?.outOfStockProducts || 23,
      bgColor: "bg-white",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.634 0L5.179 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),    },
    {
      key: "pendingProducts",
      title: t("pending"),
      value: stats?.pendingProducts || 21,
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
                {config.value.toLocaleString()}
              </p>
              <p className={`text-sm ${config.subTextColor}`}>{config.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
