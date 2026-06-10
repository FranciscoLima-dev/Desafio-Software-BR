import type { Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export class TaskController {
  list = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Listagem de tarefas sera implementada na etapa 4.");
  };

  findById = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Consulta de tarefa sera implementada na etapa 4.");
  };

  create = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Criacao de tarefa sera implementada na etapa 4.");
  };

  update = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Edicao de tarefa sera implementada na etapa 4.");
  };

  remove = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Exclusao de tarefa sera implementada na etapa 4.");
  };

  history = async (_request: Request, _response: Response): Promise<void> => {
    throw new ApiError(501, "Historico de tarefa sera implementado na etapa 5.");
  };
}

