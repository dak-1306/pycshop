import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext";

const LanguageToggle = ({ className = "", size = "normal" }) => {
  const { language, changeLanguage, isVietnamese, isEnglish } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sizeClasses = {
    small: "w-8 h-8 text-xs",
    normal: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages = [
    {
      code: "vi",
      name: "Tiếng Việt",
      flag: "🇻🇳",
      short: "VI",
    },
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
      short: "EN",
    },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizeClasses[size]}
          relative inline-flex items-center justify-center
          rounded-lg border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
          transition-all duration-200 ease-in-out
          shadow-sm hover:shadow-md
        `}
        title="Chuyển đổi ngôn ngữ / Change language"
        aria-label="Language selector"
      >
        <span className="font-semibold">{currentLanguage?.short}</span>
        <svg
          className={`w-3 h-3 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-150
                  ${
                    language === lang.code
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : "text-gray-700 dark:text-gray-200"
                  }
                `}
              >
                <span className="mr-3 text-lg">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {language === lang.code && (
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
