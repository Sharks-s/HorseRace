import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token if available
api.interceptors.request.use(
  (config) => {
    // Nếu token lưu trong localStorage
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Unauthorized: token expired or invalid
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Dispatch custom event for App/Toast to catch
        window.dispatchEvent(new CustomEvent("auth-error", { detail: { message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." } }));
        window.location.href = "/login";
      } else if (status === 403) {
        // Forbidden: no permission
        window.dispatchEvent(new CustomEvent("api-error", { detail: { message: "Bạn không có quyền thực hiện hành động này." } }));
      } else if (status >= 500) {
        // Server error
        window.dispatchEvent(new CustomEvent("api-error", { detail: { message: "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau." } }));
      }
    } else if (error.request) {
      // Network error
      window.dispatchEvent(new CustomEvent("api-error", { detail: { message: "Lỗi kết nối mạng." } }));
    }
    return Promise.reject(error);
  }
);
