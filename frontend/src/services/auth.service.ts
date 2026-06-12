import { api } from "./api";
import type { ApiResponse } from "../types/api";
import type { AuthSession } from "../types/auth";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const unwrapAuthResponse = (response: ApiResponse<AuthSession>): AuthSession => {
  if (!response.data) {
    throw new Error(response.message ?? "Resposta invalida do servidor.");
  }

  return response.data;
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthSession>>("/auth/login", payload);
    return unwrapAuthResponse(response.data);
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthSession>>("/auth/register", payload);
    return unwrapAuthResponse(response.data);
  },

  async logout(): Promise<void> {
    await api.post<ApiResponse<never>>("/auth/logout");
  },
};

