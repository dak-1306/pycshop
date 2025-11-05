import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderStats = React.memo(({ stats = {} }) => {
  const statsConfig = useMemo(
    () => [
      {
        key: "totalOrders",
        title: "Tổng đơn hàng",
        value: stats?.totalOrders?.value || stats?.totalOrders || 856,
        bgColor: "bg-white",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        textColor: "text-gray-900",
        subTextColor: "text-gray-600",
        icon: <FontAwesomeIcon icon={["fas", "boxes"]} className="w-6 h-6" />,
      },
      {
        key: "pendingOrders",
        title: "Chờ xử lý",
        value: stats?.pendingOrders?.value || stats?.pendingOrders || 23,
        bgColor: "bg-white",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        textColor: "text-gray-900",
        subTextColor: "text-gray-600",
        icon: (
          <FontAwesomeIcon
            icon={["fas", "hourglass-half"]}
            className="w-6 h-6"
          />
        ),
      },
      {
        key: "completedOrders",
        title: "Hoàn thành",
        value: stats?.completedOrders?.value || stats?.completedOrders || 789,
        bgColor: "bg-white",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        textColor: "text-gray-900",
        subTextColor: "text-gray-600",
        icon: (
          <FontAwesomeIcon icon={["fas", "check-circle"]} className="w-6 h-6" />
        ),
      },
      {
        key: "totalRevenue",
        title: "Tổng doanh thu",
        value: stats?.totalRevenue?.value || stats?.totalRevenue || 285460000,
        isRevenue: true,
        bgColor: "bg-white",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        textColor: "text-gray-900",
        subTextColor: "text-gray-600",
        icon: (
          <FontAwesomeIcon
            icon={["fas", "money-bill-wave"]}
            className="w-6 h-6"
          />
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
});

OrderStats.displayName = "OrderStats";

OrderStats.propTypes = {
  stats: PropTypes.shape({
    totalOrders: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
    pendingOrders: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
    completedOrders: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
    totalRevenue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
  }),
};

export default OrderStats;
