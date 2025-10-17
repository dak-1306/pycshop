import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ChartWrapper from "./ChartWrapper";
import {
  normalizeChartData,
  chartContainerClass,
  chartHeaderClass,
  chartTitleClass,
  chartFooterClass,
} from "./chartUtils";

const UserAnalyticsChart = React.memo(
  ({
    data = [],
    title = "Phân tích người dùng",
    isLoading = false,
    error = null,
    height = 320,
    options = {},
    onDetailClick = null,
  }) => {
    // Normalize and validate data
    const chartData = useMemo(
      () => normalizeChartData(data, "userAnalytics"),
      [data]
    );

    // Custom tooltip component
    const CustomTooltip = useMemo(
      () =>
        ({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            return (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{data.name}</p>
                <p style={{ color: data.payload.color }}>
                  {`Tỉ lệ: ${data.value}%`}
                </p>
              </div>
            );
          }
          return null;
        },
      []
    );

    // Custom label function for pie chart
    const renderCustomizedLabel = useMemo(
      () =>
        ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill="white"
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline="central"
              fontSize={12}
              fontWeight="bold"
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        },
      []
    );

    // Chart options
    const chartOptions = useMemo(
      () => ({
        customTooltip: CustomTooltip,
        customLabel: renderCustomizedLabel,
        radius: 80,
        ...options,
      }),
      [options, CustomTooltip, renderCustomizedLabel]
    );

    // Error state
    if (error) {
      return (
        <div className={chartContainerClass}>
          <div className={chartHeaderClass}>
            <h3 className={chartTitleClass}>{title}</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-red-50 rounded-lg border-2 border-dashed border-red-200">
            <div className="text-center">
              <span className="text-red-500 text-sm">
                ⚠️ Không thể tải dữ liệu biểu đồ
              </span>
              <p className="text-red-400 text-xs mt-1">
                Đang hiển thị dữ liệu mẫu
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={chartContainerClass}>
        <div className={chartHeaderClass}>
          <h3 className={chartTitleClass}>{title}</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">Phân loại theo vai trò</div>
            {onDetailClick && (
              <button
                onClick={onDetailClick}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Chi tiết
              </button>
            )}
          </div>
        </div>

        <ChartWrapper
          type="pie"
          data={chartData}
          options={chartOptions}
          height={height}
          title={title}
          isLoading={isLoading}
        />

        <div className={chartFooterClass}>
          <span>Pie Chart</span>
          <span>Dữ liệu thời gian thực</span>
        </div>
      </div>
    );
  }
);

UserAnalyticsChart.displayName = "UserAnalyticsChart";

UserAnalyticsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      color: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.object,
  onDetailClick: PropTypes.func,
};

export default UserAnalyticsChart;
