// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Default headers for API requests
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Network error",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Response interceptor for handling common errors
const handleApiError = (error) => {
  if (error.message.includes("401") || error.message.includes("Unauthorized")) {
    // Clear auth tokens on unauthorized
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    // Redirect to login if needed
    if (window.location.pathname !== "/auth/login") {
      window.location.href = "/auth/login";
    }
  }
  throw error;
};

// Generic API methods
export const api = {
  get: async (url, options = {}) => {
    try {
      return await makeAuthenticatedRequest(url, { ...options, method: "GET" });
    } catch (error) {
      return handleApiError(error);
    }
  },

  post: async (url, data, options = {}) => {
    try {
      return await makeAuthenticatedRequest(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  put: async (url, data, options = {}) => {
    try {
      return await makeAuthenticatedRequest(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  patch: async (url, data, options = {}) => {
    try {
      return await makeAuthenticatedRequest(url, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (url, options = {}) => {
    try {
      return await makeAuthenticatedRequest(url, {
        ...options,
        method: "DELETE",
      });
    } catch (error) {
      return handleApiError(error);
    }
  },

  // File upload method
  upload: async (url, formData, options = {}) => {
    const token = getAuthToken();

    const headers = {
      ...options.headers,
    };

    // Don't set Content-Type for FormData, let browser set it
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Upload failed",
        }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default api;
