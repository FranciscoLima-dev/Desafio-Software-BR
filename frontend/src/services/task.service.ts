import { api } from "./api";
import type { ApiResponse } from "../types/api";
import type { Task, TaskFilters, TaskHistoryEntry, TaskPayload, TaskStatus } from "../types/task";

const cleanFilters = (filters: TaskFilters): TaskFilters =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => Boolean(value))) as TaskFilters;

const unwrapTask = (response: ApiResponse<Task>): Task => {
  if (!response.data) {
    throw new Error(response.message ?? "Tarefa não encontrada.");
  }

  return response.data;
};

export const taskService = {
  async list(filters: TaskFilters): Promise<Task[]> {
    const response = await api.get<ApiResponse<Task[]>>("/tasks", {
      params: cleanFilters(filters),
    });

    return response.data.data ?? [];
  },

  async findById(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return unwrapTask(response.data);
  },

  async create(payload: TaskPayload): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>("/tasks", payload);
    return unwrapTask(response.data);
  },

  async update(id: string, payload: TaskPayload): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
    return unwrapTask(response.data);
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<never>>(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
    });

    return unwrapTask(response.data);
  },

  async history(id: string): Promise<TaskHistoryEntry[]> {
    const response = await api.get<ApiResponse<TaskHistoryEntry[]>>(`/tasks/${id}/history`);

    return response.data.data ?? [];
  },
};
