import { api } from "../../../api/axios";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";
import { ApiResponse } from "../../../api/api.types";

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<string>>("/auth/logout");
    return response.data;
  },
};
