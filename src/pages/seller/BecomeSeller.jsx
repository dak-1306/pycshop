import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../hooks/api/useCategories";
import { useFormValidation } from "../../hooks/form/useFormValidation";
import useBecomeSeller from "../../hooks/seller/useBecomeSeller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormField from "../../components/common/ui/FormField";

const BecomeSeller = () => {
  // Icon components for form fields
  const StoreIcon = ({ className }) => (
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
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const LocationIcon = ({ className }) => (
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
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const PhoneIcon = ({ className }) => (
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
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
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
          <FormField
            id="shopName"
            name="shopName"
            type="text"
            label="Tên Shop"
            value={formData.shopName}
            onChange={handleInputChange}
            placeholder="Nhập tên shop của bạn"
            required
            variant="light"
            icon={StoreIcon}
          />

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
          <FormField
            id="shopAddress"
            name="shopAddress"
            type="text"
            label="Địa chỉ Shop"
            value={formData.shopAddress}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ shop của bạn"
            required
            variant="light"
            icon={LocationIcon}
          />

          {/* Shop Phone */}
          <FormField
            id="shopPhone"
            name="shopPhone"
            type="tel"
            label="Số điện thoại Shop"
            value={formData.shopPhone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại liên hệ (VD: 0123456789)"
            pattern="[0-9]{10,11}"
            title="Số điện thoại phải có 10-11 số"
            required
            variant="light"
            icon={PhoneIcon}
          />

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
