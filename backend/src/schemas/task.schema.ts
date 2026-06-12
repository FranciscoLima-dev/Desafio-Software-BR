import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const taskIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  responsible: z.string().trim().optional(),
  dueDate: z.coerce.date(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "Informe ao menos um campo para atualizar.");

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const listTasksQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  responsible: z.string().trim().optional(),
  dueDate: z.coerce.date().optional(),
  search: z.string().trim().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
