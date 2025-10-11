import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const AdvancedReportFilters = ({ dateRange, onDateRangeChange, onFilterChange }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    reportType: 'all',
    category: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
    userType: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (type, value) => {
    const newDateRange = {
      ...dateRange,
      [type]: new Date(value)
    };
    onDateRangeChange(newDateRange);
  };

  const resetFilters = () => {
    const defaultFilters = {
      reportType: 'all',
      category: 'all',
      status: 'all',
      minAmount: '',
      maxAmount: '',
      userType: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    
    const defaultDateRange = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    };
    onDateRangeChange(defaultDateRange);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🔍 Bộ lọc báo cáo nâng cao
        </h3>
        <button
          onClick={resetFilters}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {t("reset")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("selectDateRange")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại báo cáo
          </label>
          <select
            value={filters.reportType}
            onChange={(e) => handleFilterChange('reportType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="sales">Doanh thu</option>
            <option value="users">Người dùng</option>
            <option value="products">Sản phẩm</option>
            <option value="orders">Đơn hàng</option>
          </select>
        </div>

        {/* User Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại người dùng
          </label>
          <select
            value={filters.userType}
            onChange={(e) => handleFilterChange('userType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="buyers">Người mua</option>
            <option value="sellers">Người bán</option>
            <option value="admins">Quản trị viên</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="electronics">Điện tử</option>
            <option value="fashion">Thời trang</option>
            <option value="books">Sách</option>
            <option value="home">Nhà cửa</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        {/* Amount Range */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng giá trị (VNĐ)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Từ"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Đến"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Quick Date Presets */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Khoảng thời gian nhanh
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Hôm nay', days: 0 },
            { label: '7 ngày', days: 7 },
            { label: '30 ngày', days: 30 },
            { label: '90 ngày', days: 90 },
            { label: '1 năm', days: 365 }
          ].map(({ label, days }) => (
            <button
              key={days}
              onClick={() => {
                const endDate = new Date();
                const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
                onDateRangeChange({ startDate, endDate });
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportFilters;
