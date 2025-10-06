// Storage utilities
export const storage = {
  // Local Storage
  local: {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
      }
    },

    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
        return false;
      }
    },

    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
        return false;
      }
    },

    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
      }
    },
  },

  // Session Storage
  session: {
    get: (key, defaultValue = null) => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading from sessionStorage key "${key}":`, error);
        return defaultValue;
      }
    },

    set: (key, value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Error writing to sessionStorage key "${key}":`, error);
        return false;
      }
    },

    remove: (key) => {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing sessionStorage key "${key}":`, error);
        return false;
      }
    },

    clear: () => {
      try {
        sessionStorage.clear();
        return true;
      } catch (error) {
        console.error("Error clearing sessionStorage:", error);
        return false;
      }
    },
  },
};

// URL utilities
export const url = {
  // Build query string from object
  buildQuery: (params) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => query.append(key, item));
        } else {
          query.append(key, value);
        }
      }
    });

    return query.toString();
  },

  // Parse query string to object
  parseQuery: (queryString = window.location.search) => {
    const params = new URLSearchParams(queryString);
    const result = {};

    for (const [key, value] of params.entries()) {
      if (result[key]) {
        // Handle multiple values for same key
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  },

  // Get current domain
  getDomain: () => {
    return window.location.origin;
  },

  // Navigate to URL
  navigate: (path) => {
    window.location.href = path;
  },

  // Reload page
  reload: () => {
    window.location.reload();
  },
};

// DOM utilities
export const dom = {
  // Check if element exists
  exists: (selector) => {
    return document.querySelector(selector) !== null;
  },

  // Get element
  get: (selector) => {
    return document.querySelector(selector);
  },

  // Get all elements
  getAll: (selector) => {
    return Array.from(document.querySelectorAll(selector));
  },

  // Add class
  addClass: (element, className) => {
    if (element && element.classList) {
      element.classList.add(className);
    }
  },

  // Remove class
  removeClass: (element, className) => {
    if (element && element.classList) {
      element.classList.remove(className);
    }
  },

  // Toggle class
  toggleClass: (element, className) => {
    if (element && element.classList) {
      element.classList.toggle(className);
    }
  },

  // Has class
  hasClass: (element, className) => {
    return (
      element && element.classList && element.classList.contains(className)
    );
  },

  // Create element
  create: (tag, attributes = {}, content = "") => {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (content) {
      element.textContent = content;
    }

    return element;
  },
};

// File utilities
export const file = {
  // Read file as text
  readAsText: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  },

  // Read file as data URL
  readAsDataURL: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  // Download data as file
  download: (data, filename, type = "text/plain") => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  },

  // Validate file type
  isValidType: (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  },

  // Validate file size
  isValidSize: (file, maxSize) => {
    return file.size <= maxSize;
  },
};

// Array utilities
export const array = {
  // Remove duplicates
  unique: (arr, key = null) => {
    if (key) {
      const seen = new Set();
      return arr.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
    return [...new Set(arr)];
  },

  // Group by key
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort by key
  sortBy: (arr, key, order = "asc") => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (order === "desc") {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  },

  // Chunk array
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
};
