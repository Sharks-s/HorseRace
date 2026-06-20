import axios from "axios";

import { toast } from "../shared/components/Toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let requestCount = 0;

const emitLoading = (isLoading: boolean) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("global-loading", {
        detail: isLoading,
      }),
    );
  }
};

const updateLoading = (delta: number) => {
  requestCount = Math.max(0, requestCount + delta);
  emitLoading(requestCount > 0);
};

const getErrorMessage = (error: unknown) => {
  const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
  const data = response?.data;

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong";
};

api.interceptors.request.use(
  (config) => {
    updateLoading(1);
    return config;
  },
  (error) => {
    updateLoading(-1);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    updateLoading(-1);
    return response;
  },
  (error) => {
    updateLoading(-1);
    toast.error(getErrorMessage(error));
    return Promise.reject(error);
  },
);
