import { z } from "zod";
import type { TaskPayload } from "../types/task";

const dateInputSchema = z
  .string()
  .min(1, "Informe a data limite.")
  .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
    message: "Informe uma data valida.",
  });

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Informe o titulo da tarefa."),
  description: z.string().trim().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  responsible: z.string().trim().optional(),
  dueDate: dateInputSchema,
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const toTaskPayload = (values: TaskFormValues): TaskPayload => ({
  title: values.title,
  description: values.description || undefined,
  status: values.status,
  priority: values.priority,
  responsible: values.responsible || undefined,
  dueDate: new Date(`${values.dueDate}T00:00:00`).toISOString(),
});

