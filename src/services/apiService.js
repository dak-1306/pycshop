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

// Generic API methods
export const api = {
  get: (url, options = {}) =>
    makeAuthenticatedRequest(url, { ...options, method: "GET" }),

  post: (url, data, options = {}) =>
    makeAuthenticatedRequest(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (url, data, options = {}) =>
    makeAuthenticatedRequest(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (url, options = {}) =>
    makeAuthenticatedRequest(url, { ...options, method: "DELETE" }),
};

export default api;
