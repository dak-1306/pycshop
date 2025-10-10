import { useState } from "react";

/**
 * BecomeSellerForm Component
 * Form component for seller registration
 */
const BecomeSellerForm = ({
  categories,
  isLoadingCategories,
  onSubmit,
  isSubmitting,
  submitError,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopCategory: "",
    shopAddress: "",
    shopPhone: "",
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Shop Name */}
      <FormField
        label="Tên Shop"
        name="shopName"
        type="text"
        value={formData.shopName}
        onChange={handleInputChange}
        placeholder="Nhập tên shop của bạn"
        required
      />

      {/* Shop Description */}
      <FormField
        label="Mô tả Shop"
        name="shopDescription"
        type="textarea"
        value={formData.shopDescription}
        onChange={handleInputChange}
        placeholder="Mô tả về shop và sản phẩm của bạn"
        required
        rows={4}
      />

      {/* Shop Category */}
      <FormField
        label="Danh mục Shop"
        name="shopCategory"
        type="select"
        value={formData.shopCategory}
        onChange={handleInputChange}
        required
        options={categories}
        isLoading={isLoadingCategories}
        placeholder="Chọn danh mục shop"
      />

      {/* Shop Address */}
      <FormField
        label="Địa chỉ Shop"
        name="shopAddress"
        type="text"
        value={formData.shopAddress}
        onChange={handleInputChange}
        placeholder="Nhập địa chỉ shop của bạn"
        required
      />

      {/* Shop Phone */}
      <FormField
        label="Số điện thoại Shop"
        name="shopPhone"
        type="tel"
        value={formData.shopPhone}
        onChange={handleInputChange}
        placeholder="Nhập số điện thoại liên hệ"
        required
      />

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Đang xử lý...</span>
            </div>
          ) : (
            "Đăng ký Seller"
          )}
        </button>
      </div>
    </form>
  );
};

/**
 * Reusable FormField Component
 */
const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
  rows,
  options = [],
  isLoading = false,
}) => {
  const baseClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${baseClasses} resize-vertical`}
          placeholder={placeholder}
          required={required}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
          required={required}
          disabled={isLoading}
        >
          <option value="">{isLoading ? "Đang tải..." : placeholder}</option>
          {options.map((option) => (
            <option
              key={option.id || option.ID_DanhMuc}
              value={option.name || option.TenDanhMuc}
            >
              {option.name || option.TenDanhMuc}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default BecomeSellerForm;
