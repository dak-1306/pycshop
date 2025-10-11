import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const ExportDropdown = ({ onExport }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const exportOptions = [
    {
      format: 'json',
      label: 'JSON',
      icon: '📄',
      description: 'Dữ liệu đầy đủ cho developers'
    },
    {
      format: 'csv',
      label: 'CSV',
      icon: '📊',
      description: 'Dữ liệu bảng cho Excel'
    },
    {
      format: 'excel',
      label: 'Excel',
      icon: '📈',
      description: 'Báo cáo định dạng Excel'
    },
    {
      format: 'pdf',
      label: 'PDF',
      icon: '📋',
      description: 'Báo cáo PDF để in ấn'
    }
  ];

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {t("exportReport")}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider border-b">
              Chọn định dạng xuất
            </div>
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
              >
                <span className="text-xl mt-0.5">{option.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
