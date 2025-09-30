import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import signupGif from "../../images/signup.gif";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    agreeTerms: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register data:", formData);
  };

  const openTermsModal = () => {
    setModalContent({
      title: "Điều khoản sử dụng",
      content: `
        <h3>1. Chấp nhận điều khoản</h3>
        <p>Bằng việc sử dụng dịch vụ PycShop, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.</p>
        
        <h3>2. Sử dụng dịch vụ</h3>
        <p>Bạn có trách nhiệm sử dụng dịch vụ một cách hợp pháp và không vi phạm quyền lợi của người khác.</p>
        
        <h3>3. Tài khoản người dùng</h3>
        <p>Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.</p>
        
        <h3>4. Quyền sở hữu trí tuệ</h3>
        <p>Tất cả nội dung trên PycShop đều thuộc bản quyền của chúng tôi hoặc đối tác.</p>
        
        <h3>5. Giới hạn trách nhiệm</h3>
        <p>PycShop không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng dịch vụ.</p>
      `,
    });
    setShowModal(true);
  };

  const openPrivacyModal = () => {
    setModalContent({
      title: "Chính sách bảo mật",
      content: `
        <h3>1. Thu thập thông tin</h3>
        <p>Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, mua hàng hoặc liên hệ với chúng tôi.</p>
        
        <h3>2. Sử dụng thông tin</h3>
        <p>Thông tin của bạn được sử dụng để cung cấp dịch vụ, xử lý đơn hàng và cải thiện trải nghiệm người dùng.</p>
        
        <h3>3. Bảo vệ thông tin</h3>
        <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn.</p>
        
        <h3>4. Chia sẻ thông tin</h3>
        <p>Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân với bên thứ ba không có sự đồng ý của bạn.</p>
        
        <h3>5. Cookie</h3>
        <p>Website sử dụng cookie để cải thiện trải nghiệm duyệt web của bạn.</p>
      `,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent({ title: "", content: "" });
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* Left Panel - Image */}
        <div className="register-image-panel">
          <img
            src={signupGif}
            alt="Register Background"
            className="register-image"
          />
        </div>

        {/* Right Panel - Register Form */}
        <div className="register-form-panel">
          <Link to="/" className="back-to-home">
            <i className="fas fa-arrow-left"></i>Về trang chủ
          </Link>

          <div className="register-header">
            <h1 className="register-title">Đăng ký</h1>
            <p className="register-subtitle">Tạo tài khoản PycShop của bạn!</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name Input */}
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Email and Phone in same row */}
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Password and Confirm Password in same row */}
            <div className="form-row">
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="checkbox-input"
                required
              />
              <label htmlFor="agreeTerms" className="checkbox-label">
                Tôi đồng ý với{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openTermsModal();
                  }}
                  className="terms-link"
                >
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openPrivacyModal();
                  }}
                  className="terms-link"
                >
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button type="submit" className="register-button">
              Đăng ký
            </button>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line">
                <div className="divider-border"></div>
              </div>
              <div className="divider-text">
                <span className="divider-label">HOẶC</span>
              </div>
            </div>

            {/* Social Register */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center 
                gap-2 px-4 py-2 border border-blue-500 text-blue-500 
                rounded-lg 
                hover:bg-blue-500 transition-all"
                onMouseEnter={(e) => {
                  e.target.style.color = "white";
                  e.target.querySelector("span").style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#3b82f6";
                  e.target.querySelector("span").style.color = "#3b82f6";
                }}
              >
                <i
                  className="fab fa-facebook text-blue-600"
                  style={{
                    verticalAlign: "middle",
                    position: "relative",
                    top: "-4px",
                    fontSize: "1.2rem",
                  }}
                ></i>
                <span style={{ verticalAlign: "middle" }}>Facebook</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-400 transition-all"
                onMouseEnter={(e) => {
                  e.target.style.color = "white";
                  e.target.querySelector("span").style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#f87171";
                  e.target.querySelector("span").style.color = "#f87171";
                }}
              >
                <i
                  className="fab fa-google text-red-500"
                  style={{
                    verticalAlign: "middle",
                    position: "relative",
                    top: "-4px",
                    fontSize: "1.2rem",
                  }}
                ></i>
                <span style={{ verticalAlign: "middle" }}>Google</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="login-link-text">
              Đã có tài khoản?
              <Link to="/login" className="login-link">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalContent.title}</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: modalContent.content }}
            ></div>
            <div className="modal-footer">
              <button className="modal-btn-close" onClick={closeModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
