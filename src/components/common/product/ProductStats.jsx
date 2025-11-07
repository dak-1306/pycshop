import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../../../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductStats = ({ stats = {} }) => {
  const { t } = useLanguage();
  const statsConfig = [
    {
      key: "totalProducts",
      title: t("totalProducts"),
      value: stats?.totalProducts?.value || stats?.totalProducts || 342,
      bgColor: "bg-white",
      iconBg: "bg-info bg-opacity-10",
      iconColor: "text-info",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
      icon: <FontAwesomeIcon icon={["fas", "boxes"]} className="w-6 h-6" />,
    },
    {
      key: "activeProducts",
      title: t("activeProducts"),
      value: stats?.activeProducts?.value || stats?.activeProducts || 298,
      bgColor: "bg-white",
      iconBg: "bg-success bg-opacity-10",
      iconColor: "text-success",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
      icon: (
        <FontAwesomeIcon icon={["fas", "check-circle"]} className="w-6 h-6" />
      ),
    },
    {
      key: "outOfStockProducts",
      title: t("outOfStock"),
      value:
        stats?.outOfStockProducts?.value || stats?.outOfStockProducts || 23,
      bgColor: "bg-white",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
      icon: (
        <FontAwesomeIcon
          icon={["fas", "exclamation-triangle"]}
          className="w-6 h-6"
        />
      ),
    },
    {
      key: "pendingProducts",
      title: t("pending"),
      value: stats?.pendingProducts?.value || stats?.pendingProducts || 21,
      bgColor: "bg-white",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-gray-900",
      subTextColor: "text-gray-600",
      icon: (
        <FontAwesomeIcon icon={["fas", "hourglass-half"]} className="w-6 h-6" />
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
                {(Number(config.value) || 0).toLocaleString()}
              </p>
              <p className={`text-sm ${config.subTextColor}`}>{config.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ProductStats.propTypes = {
  stats: PropTypes.shape({
    totalProducts: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
    activeProducts: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
    outOfStockProducts: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.number,
        formattedValue: PropTypes.string,
        label: PropTypes.string,
        icon: PropTypes.string,
      }),
    ]),
    pendingProducts: PropTypes.oneOfType([
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

export default ProductStats;
