import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logoImage from "../../images/logo.png";
const Header = () => {
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-left">
            <a href="#" className="header-link">
              <i className="fa-solid fa-shop" style={{ color: 'white' }}></i>
              Kênh Người Bán
            </a>
            <span className="divider">|</span>
            <a href="#" className="header-link">
              Trở thành Người bán Pycshop
            </a>
            <span className="divider">|</span>
            <a href="#" className="header-link">
              Tải ứng dụng
            </a>
            <span className="divider">|</span>
            <a href="#" className="header-link">
              <i className="fa-solid fa-link" style={{ color: 'white' }}></i>
              Kết nối
            </a>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fa-brands fa-facebook" style={{ color: 'white' }}></i>
                Facebook
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-instagram" style={{ color: 'white' }}></i>
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
                  // src="/logo-shopee.svg"
                  src={logoImage}
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
                  <i className="fas fa-search" style={{ color: 'white' }}></i>
                </button>
              </div>
            </div>

            {/* Cart */}
            <div className="cart">
              <div className="cart-icon">
                <i className="fas fa-shopping-cart" style={{ color: 'white' }}></i>
                <span className="cart-count">0</span>
              </div>
            </div>
            {/* Auth Buttons */}
            <div className="auth-buttons">
              <Link to="/register" className="auth-btn register-btn">
                Đăng ký
              </Link>
              <Link to="/login" className="auth-btn login-btn">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
