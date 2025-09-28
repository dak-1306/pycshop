import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-left">
            <a href="#" className="header-link">
              Kênh Người Bán
            </a>
            <span className="divider">|</span>
            <a href="#" className="header-link">
              Kết nối
            </a>
            <div className="social-links">
              <a href="#" className="social-link">
                Facebook
              </a>
              <a href="#" className="social-link">
                Instagram
              </a>
            </div>
          </div>
          <div className="header-top-right">
            <a href="#" className="header-link">
              Thông báo
            </a>
            <a href="#" className="header-link">
              Hỗ trợ
            </a>
            <a href="#" className="header-link">
              Tiếng Việt
            </a>
            <a href="#" className="header-link">
              Đăng ký
            </a>
            <span className="divider">|</span>
            <a href="#" className="header-link">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            {/* Logo */}
            <div className="logo">
              <a href="/">
                <img
                  src="/logo-shopee.svg"
                  alt="PycShop"
                  className="logo-img"
                />
              </a>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm trong Shop"
                  className="search-input"
                />
                <button className="search-btn">
                  <svg width="20" height="20" viewBox="0 0 19 19">
                    <g fillRule="evenodd">
                      <path d="m7.5 1c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5 2.9-6.5 6.5-6.5zm0 1c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5-2.5-5.5-5.5-5.5z" />
                      <path d="m12.3 12.3c.3-.3.8-.3 1.1 0l3.6 3.6c.3.3.3.8 0 1.1-.3.3-.8.3-1.1 0l-3.6-3.6c-.3-.3-.3-.8 0-1.1" />
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            {/* Cart */}
            <div className="cart">
              <div className="cart-icon">
                <svg width="26" height="26" viewBox="0 0 26 26">
                  <g fill="none" fillRule="evenodd">
                    <circle cx="13" cy="13" r="13" />
                    <path
                      d="M6.5 5.5h.9c.4 0 .8.3.9.7l1.8 7.2c.1.4.5.7.9.7h7.5c.4 0 .8-.3.9-.7l1.1-4.4H9.5"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <circle
                      cx="11"
                      cy="20.5"
                      r="1.5"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="20.5"
                      r="1.5"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
                <span className="cart-count">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
