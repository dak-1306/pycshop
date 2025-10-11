import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const ReportFilters = ({ dateRange, onDateRangeChange }) => {
  const { t } = useLanguage();
  const handleDateChange = (field, value) => {
    onDateRangeChange({
      ...dateRange,
      [field]: new Date(value),
    });
  };
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const presetRanges = [
    {
      label: t("last7Days"),
      getValue: () => ({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      }),
    },
    {
      label: t("last30Days"),
      getValue: () => ({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      }),
    },
    {
      label: t("last90Days"),
      getValue: () => ({
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      }),
    },
    {
      label: t("thisMonth"),
      getValue: () => {
        const now = new Date();
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          endDate: new Date(),
        };
      },
    },
    {
      label: t("lastMonth"),
      getValue: () => {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          startDate: lastMonth,
          endDate: lastDayOfLastMonth,
        };
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            📅 {t("timeFilter")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("selectTimeRange")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={formatDateForInput(dateRange.startDate)}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={formatDateForInput(dateRange.endDate)}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                onDateRangeChange({
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  endDate: new Date(),
                });
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              30 ngày gần đây
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
