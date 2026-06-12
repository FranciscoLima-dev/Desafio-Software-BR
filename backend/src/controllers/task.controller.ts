import type { Request, Response } from "express";
import { TaskService } from "../services/task.service.js";
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "../schemas/task.schema.js";
import { ApiError } from "../utils/api-error.js";

export class TaskController {
  constructor(private readonly taskService = new TaskService()) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const tasks = await this.taskService.list(
      this.getAuthenticatedUserId(request),
      request.query as ListTasksQuery,
    );

    response.status(200).json({
      success: true,
      data: tasks,
    });
  };

  findById = async (request: Request, response: Response): Promise<void> => {
    const task = await this.taskService.findById(
      this.getAuthenticatedUserId(request),
      request.params.id,
    );

    response.status(200).json({
      success: true,
      data: task,
    });
  };

  create = async (request: Request, response: Response): Promise<void> => {
    const task = await this.taskService.create(
      this.getAuthenticatedUserId(request),
      request.body as CreateTaskInput,
    );

    response.status(201).json({
      success: true,
      message: "Tarefa criada com sucesso.",
      data: task,
    });
  };

  update = async (request: Request, response: Response): Promise<void> => {
    const task = await this.taskService.update(
      this.getAuthenticatedUserId(request),
      request.params.id,
      request.body as UpdateTaskInput,
    );

    response.status(200).json({
      success: true,
      message: "Tarefa atualizada com sucesso.",
      data: task,
    });
  };

  updateStatus = async (request: Request, response: Response): Promise<void> => {
    const { status } = request.body as UpdateTaskStatusInput;

    const task = await this.taskService.updateStatus(
      this.getAuthenticatedUserId(request),
      request.params.id,
      status,
    );

    response.status(200).json({
      success: true,
      message: "Status da tarefa atualizado com sucesso.",
      data: task,
    });
  };

  remove = async (request: Request, response: Response): Promise<void> => {
    await this.taskService.remove(this.getAuthenticatedUserId(request), request.params.id);

    response.status(200).json({
      success: true,
      message: "Tarefa excluida com sucesso.",
    });
  };

  history = async (request: Request, response: Response): Promise<void> => {
    const history = await this.taskService.history(
      this.getAuthenticatedUserId(request),
      request.params.id,
    );

    response.status(200).json({
      success: true,
      data: history,
    });
  };

  private getAuthenticatedUserId(request: Request): string {
    if (!request.user) {
      throw new ApiError(401, "Usuario nao autenticado.");
    }

    return request.user.id;
  };
}
