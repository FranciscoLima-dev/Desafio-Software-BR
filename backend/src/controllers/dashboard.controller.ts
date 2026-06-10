import type { Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export class DashboardController {
  summary = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Dashboard sera implementado na etapa 6.");
  };
}

