import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const RecentReportFilters = ({ filters, onFiltersChange, stats }) => {
  const { t } = useLanguage();

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  const statusOptions = [
    { value: 'all', label: t('allStatuses'), count: stats.total },
    { value: 'pending', label: t('pending'), count: stats.pending },
    { value: 'in_progress', label: t('inProgress'), count: stats.inProgress },
    { value: 'resolved', label: t('resolved'), count: stats.resolved },
    { value: 'rejected', label: t('rejected'), count: stats.rejected },
  ];
  const typeOptions = [
    { value: 'all', label: t('allTypes'), count: stats.total },
    { value: 'User', label: t('userReport'), count: stats.byType.User },
    { value: 'Product', label: t('productReport'), count: stats.byType.Product },
    { value: 'Shop', label: t('shopReport'), count: stats.byType.Shop },
    { value: 'Review', label: t('reviewReport'), count: stats.byType.Review },
  ];
  const priorityOptions = [
    { value: 'all', label: t('allPriorities') },    { value: 'high', label: t('high'), color: 'text-red-600' },
    { value: 'medium', label: t('medium'), color: 'text-yellow-600' },
    { value: 'low', label: t('low'), color: 'text-green-600' },
  ];
  const dateRangeOptions = [
    { value: 'today', label: t('today') || 'Hôm nay' },
    { value: 'week', label: t('thisWeek') },
    { value: 'month', label: t('thisMonth') },
    { value: 'all', label: t('allStatuses') },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          🔍 {t('filter')} {t('recentReports').toLowerCase()}
        </h4>
        <button
          onClick={() => onFiltersChange({
            status: 'all',
            type: 'all', 
            priority: 'all',
            dateRange: 'week'
          })}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('reset')} {t('filter').toLowerCase()}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('status')}
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reportType')}
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('reportPriority')}
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectDateRange')}
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          {stats.pending > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>              <span className="text-sm font-medium text-yellow-700">
                {stats.pending} {t('pending').toLowerCase()}
              </span>
            </div>
          )}
          
          {stats.highPriority > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
              <span className="text-red-500">🔥</span>              <span className="text-sm font-medium text-red-700">
                {stats.highPriority} {t('high').toLowerCase()} {t('reportPriority').toLowerCase()}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
            <span className="text-blue-500">📊</span>            <span className="text-sm font-medium text-blue-700">
              {t('totalReports')}: {stats.total}
            </span>
          </div>

          {stats.resolved > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <span className="text-green-500">✅</span>              <span className="text-sm font-medium text-green-700">
                {stats.resolved} {t('resolved').toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentReportFilters;
