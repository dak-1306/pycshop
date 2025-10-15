import React from "react";
import { Link } from "react-router-dom";
import { useAdminLogin } from "../../hooks/auth/useAdminLogin";
import FormField from "../../components/common/ui/FormField";
import PasswordField from "../../components/common/ui/PasswordField";
import { ADMIN_CONSTANTS } from "../../lib/constants/adminConstants.js";

const AdminLogin = () => {
  const {
    formData,
    loading,
    error,
    showPassword,
    handleInputChange,
    handleSubmit,
    handleDemoLogin,
    togglePasswordVisibility,
  } = useAdminLogin();

  // Email icon component
  const EmailIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {ADMIN_CONSTANTS.UI_TEXT.TITLE}
          </h1>
          <p className="text-slate-300">{ADMIN_CONSTANTS.UI_TEXT.SUBTITLE}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-red-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <FormField
              id="email"
              name="email"
              type="email"
              label={ADMIN_CONSTANTS.UI_TEXT.EMAIL_LABEL}
              value={formData.email}
              onChange={handleInputChange}
              placeholder={ADMIN_CONSTANTS.UI_TEXT.EMAIL_PLACEHOLDER}
              required
              icon={EmailIcon}
            />

            {/* Password Field */}
            <PasswordField
              id="password"
              name="password"
              label={ADMIN_CONSTANTS.UI_TEXT.PASSWORD_LABEL}
              value={formData.password}
              onChange={handleInputChange}
              placeholder={ADMIN_CONSTANTS.UI_TEXT.PASSWORD_PLACEHOLDER}
              required
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
            />

            {/* Demo Credentials Info */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">
                    {ADMIN_CONSTANTS.UI_TEXT.DEMO_INFO_TITLE}
                  </p>
                  <div className="space-y-1 text-xs text-blue-300">
                    {ADMIN_CONSTANTS.UI_TEXT.DEMO_INFO_TEXT.map(
                      (text, index) => (
                        <p key={index}>{text}</p>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    {ADMIN_CONSTANTS.UI_TEXT.DEMO_BUTTON}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{ADMIN_CONSTANTS.UI_TEXT.LOADING_BUTTON}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>{ADMIN_CONSTANTS.UI_TEXT.SUBMIT_BUTTON}</span>
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <Link
                to={ADMIN_CONSTANTS.ROUTES.CUSTOMER_LOGIN}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>{ADMIN_CONSTANTS.UI_TEXT.CUSTOMER_LOGIN_LINK}</span>
              </Link>

              <Link
                to={ADMIN_CONSTANTS.ROUTES.HOME}
                className="text-slate-300 hover:text-white transition-colors flex items-center space-x-2"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>{ADMIN_CONSTANTS.UI_TEXT.HOME_LINK}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            {ADMIN_CONSTANTS.UI_TEXT.SECURITY_NOTICE}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
