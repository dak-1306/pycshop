import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import "./Login.css"; // Giữ một số custom styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa error khi user nhập lại
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi API đăng nhập thực tế
      const response = await authService.login(
        formData.email,
        formData.password
      );

      console.log("Login successful:", response);

      // Lưu thông tin user vào context
      login(response.user, response.token);

      // Chuyển hướng về trang chủ sau khi đăng nhập thành công
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-green-800 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Background Image Section */}
        <div className="hidden lg:flex items-center justify-center p-10 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src="/images/login.gif"
            alt="Login Background"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Login Form Section */}
        <div className="p-8 lg:p-12">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-green-800 hover:text-emerald-600 text-sm mb-4 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
              Về trang chủ
            </Link>
            <h2 className="text-3xl font-bold text-green-800 font-roboto">
              Đăng nhập
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email/Số điện thoại/Tên đăng nhập"
                value={formData.email}
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="login-input password-input"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 hover:bg-emerald-600 
              text-white font-semibold py-3 px-4 
              rounded-lg transition-all duration-300 transform 
              hover:-translate-y-0.5 hover:shadow-lg uppercase 
              tracking-wide border-2 border-emerald-400
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="flex justify-between text-sm">
              <a
                href="#"
                className="text-green-800 hover:text-emerald-600 hover:underline"
              >
                Quên mật khẩu?
              </a>
              <a
                href="#"
                className="text-green-800 hover:text-emerald-600 hover:underline"
              >
                Đăng nhập SMS
              </a>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">HOẶC</span>
              </div>
            </div>

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

            <p className="text-center text-sm text-gray-600">
              Bạn mới biết đến PycShop?
              <Link
                to="/register"
                className="text-green-800 hover:text-emerald-600 hover:underline ml-1 font-medium"
              >
                Đăng ký
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
