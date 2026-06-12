import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (request: Request, response: Response): Promise<void> => {
    const data = await this.authService.register(request.body as RegisterInput);

    response.status(201).json({
      success: true,
      message: "Usuario cadastrado com sucesso.",
      data,
    });
  };

  login = async (request: Request, response: Response): Promise<void> => {
    const data = await this.authService.login(request.body as LoginInput);

    response.status(200).json({
      success: true,
      message: "Login realizado com sucesso.",
      data,
    });
  };

  logout = async (_request: Request, response: Response): Promise<void> => {
    this.authService.logout();

    response.status(200).json({
      success: true,
      message: "Logout realizado com sucesso.",
    });
  };
}
