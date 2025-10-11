import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = "", size = "normal" }) => {
  const { theme, toggleTheme, isLight, isDark } = useTheme();
  
  const sizeClasses = {
    small: "w-8 h-8",
    normal: "w-10 h-10", 
    large: "w-12 h-12"
  };
  
  const iconSize = {
    small: "w-4 h-4",
    normal: "w-5 h-5",
    large: "w-6 h-6"
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        ${className}
        relative inline-flex items-center justify-center
        rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800 
        text-gray-700 dark:text-gray-200
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
      `}
      title={isLight ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Light Mode Icon */}
      <svg
        className={`
          ${iconSize[size]} 
          absolute transition-all duration-300 ease-in-out
          ${isLight ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}
        `}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clipRule="evenodd"
        />
      </svg>
      
      {/* Dark Mode Icon */}
      <svg
        className={`
          ${iconSize[size]} 
          absolute transition-all duration-300 ease-in-out
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}
        `}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
