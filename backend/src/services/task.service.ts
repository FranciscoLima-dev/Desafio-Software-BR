import type { Task, TaskHistoryAction, TaskStatus } from "@prisma/client";
import { TaskHistoryAction as HistoryAction } from "@prisma/client";
import { TaskHistoryRepository } from "../repositories/task-history.repository.js";
import { TaskRepository } from "../repositories/task.repository.js";
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from "../schemas/task.schema.js";
import { ApiError } from "../utils/api-error.js";

type HistoryEntry = {
  taskId: string;
  action: TaskHistoryAction;
  oldValue?: string | null;
  newValue?: string | null;
};

type TaskSnapshot = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  responsible: string | null;
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export class TaskService {
  constructor(
    private readonly taskRepository = new TaskRepository(),
    private readonly taskHistoryRepository = new TaskHistoryRepository(),
  ) {}

  list(userId: string, filters: ListTasksQuery) {
    return this.taskRepository.list(userId, filters);
  }

  async findById(userId: string, id: string) {
    const task = await this.taskRepository.findById(userId, id);

    if (!task) {
      throw new ApiError(404, "Tarefa nao encontrada.");
    }

    return task;
  }

  async create(userId: string, input: CreateTaskInput) {
    const task = await this.taskRepository.create(userId, input);

    await this.taskHistoryRepository.create({
      taskId: task.id,
      action: HistoryAction.TASK_CREATED,
      oldValue: null,
      newValue: this.stringify(this.snapshot(task)),
    });

    return task;
  }

  async update(userId: string, id: string, input: UpdateTaskInput) {
    const currentTask = await this.findById(userId, id);
    const updatedTask = await this.taskRepository.update(userId, id, input);

    if (!updatedTask) {
      throw new ApiError(404, "Tarefa nao encontrada.");
    }

    const historyEntries = this.buildUpdateHistoryEntries(currentTask, updatedTask);
    await this.taskHistoryRepository.createMany(historyEntries);

    return updatedTask;
  }

  async updateStatus(userId: string, id: string, status: TaskStatus) {
    const currentTask = await this.findById(userId, id);

    if (currentTask.status === status) {
      return currentTask;
    }

    const updatedTask = await this.taskRepository.update(userId, id, { status });

    if (!updatedTask) {
      throw new ApiError(404, "Tarefa nao encontrada.");
    }

    await this.taskHistoryRepository.create({
      taskId: updatedTask.id,
      action: HistoryAction.STATUS_CHANGED,
      oldValue: currentTask.status,
      newValue: updatedTask.status,
    });

    return updatedTask;
  }

  async remove(userId: string, id: string) {
    const currentTask = await this.findById(userId, id);
    const deletedTask = await this.taskRepository.softDelete(userId, id);

    if (!deletedTask) {
      throw new ApiError(404, "Tarefa nao encontrada.");
    }

    await this.taskHistoryRepository.create({
      taskId: currentTask.id,
      action: HistoryAction.TASK_DELETED,
      oldValue: this.stringify(this.snapshot(currentTask)),
      newValue: this.stringify(this.snapshot(deletedTask)),
    });
  }

  async history(userId: string, id: string) {
    const task = await this.taskRepository.findByIdIncludingDeleted(userId, id);

    if (!task) {
      throw new ApiError(404, "Tarefa nao encontrada.");
    }

    return this.taskHistoryRepository.listByTaskId(task.id);
  }

  private buildUpdateHistoryEntries(previousTask: Task, updatedTask: Task): HistoryEntry[] {
    const entries: HistoryEntry[] = [];

    const previousSnapshot = this.snapshot(previousTask);
    const updatedSnapshot = this.snapshot(updatedTask);

    if (this.stringify(previousSnapshot) !== this.stringify(updatedSnapshot)) {
      entries.push({
        taskId: updatedTask.id,
        action: HistoryAction.TASK_UPDATED,
        oldValue: this.stringify(previousSnapshot),
        newValue: this.stringify(updatedSnapshot),
      });
    }

    if (previousTask.status !== updatedTask.status) {
      entries.push({
        taskId: updatedTask.id,
        action: HistoryAction.STATUS_CHANGED,
        oldValue: previousTask.status,
        newValue: updatedTask.status,
      });
    }

    if (previousTask.priority !== updatedTask.priority) {
      entries.push({
        taskId: updatedTask.id,
        action: HistoryAction.PRIORITY_CHANGED,
        oldValue: previousTask.priority,
        newValue: updatedTask.priority,
      });
    }

    if (previousTask.responsible !== updatedTask.responsible) {
      entries.push({
        taskId: updatedTask.id,
        action: HistoryAction.RESPONSIBLE_CHANGED,
        oldValue: previousTask.responsible,
        newValue: updatedTask.responsible,
      });
    }

    if (previousTask.dueDate.getTime() !== updatedTask.dueDate.getTime()) {
      entries.push({
        taskId: updatedTask.id,
        action: HistoryAction.DUE_DATE_CHANGED,
        oldValue: previousTask.dueDate.toISOString(),
        newValue: updatedTask.dueDate.toISOString(),
      });
    }

    return entries;
  }

  private snapshot(task: Task): TaskSnapshot {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      responsible: task.responsible,
      dueDate: task.dueDate.toISOString(),
      userId: task.userId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      deletedAt: task.deletedAt?.toISOString() ?? null,
    };
  }

  private stringify(value: unknown): string {
    return JSON.stringify(value);
  }
}
