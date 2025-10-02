import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import logoImage from "../../images/logo.png";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleSellerChannelClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Chưa đăng nhập -> chuyển đến trang login
      navigate("/login");
    } else {
      // Đã đăng nhập -> kiểm tra role
      if (user?.role === "seller") {
        // Đã là seller -> vào dashboard
        navigate("/seller/dashboard");
      } else {
        // Chưa phải seller -> đăng ký trở thành seller
        navigate("/become-seller");
      }
    }
  };
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-left">
            <a
              href="#"
              onClick={handleSellerChannelClick}
              className="header-link"
            >
              <i className="fa-solid fa-shop" style={{ color: "white" }}></i>
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
              <i className="fa-solid fa-link" style={{ color: "white" }}></i>
              Kết nối
            </a>
            <div className="social-links">
              <a href="#" className="social-link">
                <i
                  className="fa-brands fa-facebook"
                  style={{ color: "white" }}
                ></i>
                Facebook
              </a>
              <a href="#" className="social-link">
                <i
                  className="fa-brands fa-instagram"
                  style={{ color: "white" }}
                ></i>
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
                  <i className="fas fa-search" style={{ color: "white" }}></i>
                </button>
              </div>
            </div>

            {/* Cart */}
            <div className="cart">
              <div className="cart-icon">
                <i
                  className="fas fa-shopping-cart"
                  style={{ color: "white" }}
                ></i>
                <span className="cart-count">0</span>
              </div>

              {/* Cart Dropdown */}
              <div className="cart-dropdown">
                <div className="cart-dropdown-header">
                  <h3>Sản phẩm mới thêm</h3>
                </div>
                <div className="cart-dropdown-content">
                  <div className="cart-empty">
                    <div className="cart-empty-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <p>Chưa có sản phẩm</p>
                    {!isAuthenticated && (
                      <p className="login-message">
                        <Link to="/login" className="auth-link">
                          Đăng nhập
                        </Link>{" "}
                        hoặc
                        <Link to="/register" className="auth-link">
                          {" "}
                          Đăng ký
                        </Link>{" "}
                        để xem được
                      </p>
                    )}
                  </div>
                </div>
                <div className="cart-dropdown-footer">
                  <button className="view-cart-btn">Xem giỏ hàng</button>
                </div>
              </div>
            </div>
            {/* Auth Buttons */}
            <div className="auth-buttons">
              {isAuthenticated ? (
                <div className="user-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      <i className="fas fa-user" style={{ color: "white" }}></i>
                    </div>
                    <span className="user-name">
                      {user?.name || user?.email}
                    </span>
                    <i
                      className="fas fa-chevron-down"
                      style={{ color: "white", fontSize: "12px" }}
                    ></i>
                  </div>
                  <div className="user-dropdown">
                    <Link to="/profile" className="user-dropdown-item">
                      <i className="fas fa-user"></i>
                      Tài khoản của tôi
                    </Link>
                    <div className="user-dropdown-item">
                      <i className="fas fa-shopping-bag"></i>
                      Đơn mua
                    </div>
                    <div className="user-dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Đăng xuất
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/register" className="auth-btn register-btn">
                    Đăng ký
                  </Link>
                  <Link to="/login" className="auth-btn login-btn">
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
