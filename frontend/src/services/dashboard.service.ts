import { api } from "./api";
import type { ApiResponse } from "../types/api";
import type { DashboardSummary } from "../types/task";

export const dashboardService = {
  async summary(): Promise<DashboardSummary> {
    const response = await api.get<ApiResponse<DashboardSummary>>("/dashboard");

    if (!response.data.data) {
      throw new Error(response.data.message ?? "Não foi possível carregar o dashboard.");
    }

    return response.data.data;
  },
};
