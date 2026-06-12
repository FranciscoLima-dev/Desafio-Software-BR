import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";
import { ApiError } from "../utils/api-error.js";

export class DashboardController {
  constructor(private readonly dashboardService = new DashboardService()) {}

  summary = async (request: Request, response: Response): Promise<void> => {
    const summary = await this.dashboardService.summary(
      this.getAuthenticatedUserId(request),
    );

    response.status(200).json({
      success: true,
      data: summary,
    });
  };

  private getAuthenticatedUserId(request: Request): string {
    if (!request.user) {
      throw new ApiError(401, "Usuario nao autenticado.");
    }

    return request.user.id;
  };
}
