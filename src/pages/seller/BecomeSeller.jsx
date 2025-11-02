import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../hooks/api/useCategories";
import { useFormValidation } from "../../hooks/form/useFormValidation";
import useBecomeSeller from "../../hooks/seller/useBecomeSeller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { categories, isLoading: categoriesLoading } = useCategories(true);
  const { validateShopForm, errors } = useFormValidation();
  const { becomeSeller, loading: becomeLoading } = useBecomeSeller();

  // Check if user is logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      alert("Vui lòng đăng nhập trước khi đăng ký seller");
      navigate("/auth/login");
      return;
    }
  }, [loading, isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopCategory: "",
    shopAddress: "",
    shopPhone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation errors when user starts typing
    if (errors.length > 0) {
      validateShopForm({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation using custom hook
    if (!validateShopForm(formData)) {
      alert(errors.join("\n"));
      return;
    }

    // Hook handles all business logic
    const result = await becomeSeller(formData);

    // UI feedback and navigation only
    alert(result.message);
    if (result.success) {
      navigate("/seller/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-seller-500 to-seller-600 flex items-center pt-6 pb-6">
      <div className="w-1/3 mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex justify-between items-center gap-3">
          <FontAwesomeIcon
            icon={["fas", "store"]}
            className="text-seller-600"
          />
          <span>Đăng ký trở thành Seller</span>
          <Link to="/">
            <FontAwesomeIcon icon={["fas", "close"]} className="text-red-400" />
          </Link>
        </h1>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-seller-600"></div>
            <p className="mt-2 text-gray-600">Đang kiểm tra thông tin...</p>
          </div>
        )}

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-red-800 font-medium mb-2">
              Có lỗi trong form:
            </h3>
            <ul className="text-red-700 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shop Name */}
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên shop của bạn"
              required
            />
          </div>

          {/* Shop Description */}
          <div>
            <label
              htmlFor="shopDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mô tả Shop <span className="text-red-500">*</span>
            </label>
            <textarea
              id="shopDescription"
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Mô tả về shop và sản phẩm của bạn"
              required
            />
          </div>

          {/* Shop Category */}
          <div>
            <label
              htmlFor="shopCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Danh mục Shop <span className="text-red-500">*</span>
            </label>
            <select
              id="shopCategory"
              name="shopCategory"
              value={formData.shopCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading
                  ? "Đang tải danh mục..."
                  : "Chọn danh mục shop"}
              </option>
              {categories.map((category) => (
                <option
                  key={category.id || category.ID_DanhMuc}
                  value={category.name || category.TenDanhMuc}
                >
                  {category.name || category.TenDanhMuc}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Address */}
          <div>
            <label
              htmlFor="shopAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Địa chỉ Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="shopAddress"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập địa chỉ shop của bạn"
              required
            />
          </div>

          {/* Shop Phone */}
          <div>
            <label
              htmlFor="shopPhone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số điện thoại Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="shopPhone"
              name="shopPhone"
              value={formData.shopPhone}
              onChange={handleInputChange}
              pattern="[0-9]{10,11}"
              title="Số điện thoại phải có 10-11 số"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại liên hệ (VD: 0123456789)"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={becomeLoading}
              className="flex-1 px-6 py-3 bg-seller-500 text-white rounded-md hover:bg-seller-600 focus:outline-none focus:ring-2 focus:ring-seller-400 focus:border-transparent transition duration-200 disabled:bg-seller-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{becomeLoading ? "Đang xử lý..." : "Đăng ký Seller"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeSeller;
