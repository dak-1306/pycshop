import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants";

const AdminSettings = () => {
  const { theme, setLightTheme, setDarkTheme, isLight, isDark } = useTheme();
  const { language, changeLanguage, t, isVietnamese, isEnglish } =
    useLanguage();

  const [showSuccess, setShowSuccess] = useState(false);

  const showSuccessMessage = (message) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleThemeChange = (newTheme) => {
    if (newTheme === "light") {
      setLightTheme();
    } else if (newTheme === "dark") {
      setDarkTheme();
    }
    showSuccessMessage(t("themeChanged"));
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    showSuccessMessage(t("languageChanged"));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {ADMIN_CONSTANTS.PAGES.SETTINGS.TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {ADMIN_CONSTANTS.PAGES.SETTINGS.SUBTITLE}
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {showSuccess}
        </div>
      )}

      <div className="space-y-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
              {ADMIN_CONSTANTS.SETTINGS.THEME_SECTION.TITLE}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {ADMIN_CONSTANTS.SETTINGS.THEME_SECTION.SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Theme */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isLight
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mr-3 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("lightTheme")}
                  </h3>
                </div>
                {isLight && (
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {ADMIN_CONSTANTS.SETTINGS.THEME_SECTION.LIGHT_DESC}
              </p>
              <div className="mt-3 flex space-x-1">
                <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
              </div>
            </div>

            {/* Dark Theme */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isDark
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mr-3 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("darkTheme")}
                  </h3>
                </div>
                {isDark && (
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {ADMIN_CONSTANTS.SETTINGS.THEME_SECTION.DARK_DESC}
              </p>
              <div className="mt-3 flex space-x-1">
                <div className="w-3 h-3 bg-gray-800 border border-gray-600 rounded"></div>
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              {ADMIN_CONSTANTS.SETTINGS.LANGUAGE_SECTION.TITLE}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {ADMIN_CONSTANTS.SETTINGS.LANGUAGE_SECTION.SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vietnamese */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isVietnamese
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => handleLanguageChange("vi")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm">
                    🇻🇳
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("vietnamese")}
                  </h3>
                </div>
                {isVietnamese && (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {ADMIN_CONSTANTS.SETTINGS.LANGUAGE_SECTION.VI_DESC}
              </p>
            </div>

            {/* English */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                isEnglish
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm">
                    🇺🇸
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t("english")}
                  </h3>
                </div>
                {isEnglish && (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {ADMIN_CONSTANTS.SETTINGS.LANGUAGE_SECTION.EN_DESC}
              </p>
            </div>
          </div>
        </div>

        {/* Current Settings Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {ADMIN_CONSTANTS.SETTINGS.CURRENT_SETTINGS.TITLE}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-300 mr-2">
                {ADMIN_CONSTANTS.SETTINGS.CURRENT_SETTINGS.THEME_LABEL}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {theme === "light" ? "🌞 Sáng" : "🌙 Tối"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-300 mr-2">
                {ADMIN_CONSTANTS.SETTINGS.CURRENT_SETTINGS.LANGUAGE_LABEL}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {language === "vi" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
