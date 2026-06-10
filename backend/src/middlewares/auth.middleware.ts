import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export const authenticate = (
  _request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  next(new ApiError(501, "Middleware de autenticacao sera implementado na etapa 3."));
};

