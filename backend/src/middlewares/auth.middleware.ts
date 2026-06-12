import type { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/api-error.js";
import { verifyAuthToken } from "../utils/jwt.js";

const userRepository = new UserRepository();

export const authenticate = async (
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new ApiError(401, "Token de autenticacao nao informado.");
    }

    const [scheme, token] = authorizationHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      throw new ApiError(401, "Formato de autenticacao invalido.");
    }

    const payload = verifyAuthToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, "Usuario autenticado nao encontrado.");
    }

    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
