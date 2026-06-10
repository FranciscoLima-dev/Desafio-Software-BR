import type { Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export class AuthController {
  register = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Cadastro sera implementado na etapa 2.");
  };

  login = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Login sera implementado na etapa 2.");
  };

  logout = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Logout sera implementado na etapa 2.");
  };
}

