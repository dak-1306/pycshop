import { useState, useEffect, useCallback } from "react";

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const openModal = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, closeModal]);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
};

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: "Xác nhận",
    cancelText: "Hủy bỏ",
    variant: "danger",
  });

  const openConfirm = useCallback((confirmConfig) => {
    setConfig((prev) => ({ ...prev, ...confirmConfig }));
    setIsOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    config.onConfirm();
    closeConfirm();
  }, [config, closeConfirm]);

  const handleCancel = useCallback(() => {
    config.onCancel?.();
    closeConfirm();
  }, [config, closeConfirm]);

  return {
    isOpen,
    config,
    openConfirm,
    closeConfirm,
    handleConfirm,
    handleCancel,
  };
};

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return null;

      for (const rule of rules) {
        if (rule.required && (!value || value.toString().trim() === "")) {
          return rule.message || `${name} là bắt buộc`;
        }

        if (rule.minLength && value && value.length < rule.minLength) {
          return (
            rule.message || `${name} phải có ít nhất ${rule.minLength} ký tự`
          );
        }

        if (rule.maxLength && value && value.length > rule.maxLength) {
          return (
            rule.message ||
            `${name} không được vượt quá ${rule.maxLength} ký tự`
          );
        }

        if (rule.pattern && value && !rule.pattern.test(value)) {
          return rule.message || `${name} không đúng định dạng`;
        }

        if (rule.custom && typeof rule.custom === "function") {
          const result = rule.custom(value, values);
          if (result !== true) {
            return result || `${name} không hợp lệ`;
          }
        }
      }

      return null;
    },
    [validationRules, values]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, values, validateField]);

  const handleSubmit = useCallback(
    (onSubmit) => {
      return async (event) => {
        event?.preventDefault();

        setIsSubmitting(true);

        // Mark all fields as touched
        const allTouched = {};
        Object.keys(validationRules).forEach((key) => {
          allTouched[key] = true;
        });
        setTouched(allTouched);

        if (validateForm()) {
          try {
            await onSubmit(values);
          } catch (error) {
            console.error("Form submission error:", error);
          }
        }

        setIsSubmitting(false);
      };
    },
    [values, validationRules, validateForm]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
  };
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
