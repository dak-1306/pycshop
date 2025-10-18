import React, { useMemo } from "react";
import PropTypes from "prop-types";

const UserStats = ({ stats = {} }) => {
  const statsConfig = useMemo(
    () => [
      {
        key: "totalUsers",
        title: "Tổng người dùng",
        value: stats?.totalUsers || 1248,
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        ),
      },
      {
        key: "activeUsers",
        title: "Đang hoạt động",
        value: stats?.activeUsers || 1156,
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
        key: "customers",
        title: "Khách hàng",
        value: stats?.customers || 956,
        bgColor: "bg-white",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        key: "sellers",
        title: "Người bán",
        value: stats?.sellers || 289,
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
      },
    ],
    [stats]
  );

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

UserStats.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number,
    activeUsers: PropTypes.number,
    customers: PropTypes.number,
    sellers: PropTypes.number,
  }),
};

export default React.memo(UserStats);
