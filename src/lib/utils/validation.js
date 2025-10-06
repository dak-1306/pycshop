// Validation utilities
export const validate = {
  // Required field
  required: (value, message = "Trường này là bắt buộc") => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return message;
    }
    return null;
  },

  // Email validation
  email: (value, message = "Email không hợp lệ") => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  // Phone validation (Vietnamese format)
  phone: (value, message = "Số điện thoại không hợp lệ") => {
    if (!value) return null;
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(value) ? null : message;
  },

  // Min length validation
  minLength:
    (min) =>
    (value, message = `Tối thiểu ${min} ký tự`) => {
      if (!value) return null;
      return value.length >= min ? null : message;
    },

  // Max length validation
  maxLength:
    (max) =>
    (value, message = `Tối đa ${max} ký tự`) => {
      if (!value) return null;
      return value.length <= max ? null : message;
    },

  // Pattern validation
  pattern:
    (regex, message = "Định dạng không hợp lệ") =>
    (value) => {
      if (!value) return null;
      return regex.test(value) ? null : message;
    },

  // Number validation
  number: (value, message = "Phải là số") => {
    if (!value) return null;
    return !isNaN(value) && !isNaN(parseFloat(value)) ? null : message;
  },

  // Min value validation
  min:
    (minVal) =>
    (value, message = `Giá trị tối thiểu là ${minVal}`) => {
      if (!value) return null;
      const num = parseFloat(value);
      return num >= minVal ? null : message;
    },

  // Max value validation
  max:
    (maxVal) =>
    (value, message = `Giá trị tối đa là ${maxVal}`) => {
      if (!value) return null;
      const num = parseFloat(value);
      return num <= maxVal ? null : message;
    },

  // Custom validation
  custom:
    (validator, message = "Giá trị không hợp lệ") =>
    (value, allValues) => {
      if (!value) return null;
      return validator(value, allValues) ? null : message;
    },

  // Password strength validation
  password: (
    value,
    message = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
  ) => {
    if (!value) return null;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value) ? null : message;
  },

  // Confirm password validation
  confirmPassword:
    (passwordField = "password") =>
    (value, allValues, message = "Mật khẩu không khớp") => {
      if (!value) return null;
      return value === allValues[passwordField] ? null : message;
    },
};

// Form validation utilities
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = Array.isArray(rules[field])
      ? rules[field]
      : [rules[field]];
    const value = values[field];

    for (const rule of fieldRules) {
      let error = null;

      if (typeof rule === "function") {
        error = rule(value, values);
      } else if (rule.validator) {
        error = rule.validator(value, values);
      }

      if (error) {
        errors[field] = error;
        break; // Stop at first error
      }
    }
  });

  return errors;
};

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// Get first error message
export const getFirstError = (errors) => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};
