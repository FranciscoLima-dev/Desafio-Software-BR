import type { TaskHistoryEntry, TaskPriority, TaskStatus } from "../types/task";

export const taskStatusLabel: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluida",
};

export const taskPriorityLabel: Record<TaskPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Media",
  HIGH: "Alta",
};

export const taskStatusOptions = [
  { label: taskStatusLabel.PENDING, value: "PENDING" },
  { label: taskStatusLabel.IN_PROGRESS, value: "IN_PROGRESS" },
  { label: taskStatusLabel.COMPLETED, value: "COMPLETED" },
] as const;

export const taskPriorityOptions = [
  { label: taskPriorityLabel.LOW, value: "LOW" },
  { label: taskPriorityLabel.MEDIUM, value: "MEDIUM" },
  { label: taskPriorityLabel.HIGH, value: "HIGH" },
] as const;

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export const toDateInputValue = (value: string): string => value.slice(0, 10);

const getSafeValue = (value?: string | null): string | null => {
  if (!value || value === "null") {
    return null;
  }

  return value;
};

export const formatHistoryDescription = (entry: TaskHistoryEntry): string => {
  const newValue = getSafeValue(entry.newValue);

  switch (entry.action) {
    case "TASK_CREATED":
      return "Tarefa criada";
    case "TASK_UPDATED":
      return "Tarefa atualizada";
    case "TASK_DELETED":
      return "Tarefa excluida";
    case "STATUS_CHANGED":
      return `Status alterado para ${newValue ? taskStatusLabel[newValue as TaskStatus] : "nao definido"}`;
    case "PRIORITY_CHANGED":
      return `Prioridade alterada para ${newValue ? taskPriorityLabel[newValue as TaskPriority] : "nao definida"}`;
    case "RESPONSIBLE_CHANGED":
      return `Responsavel alterado para ${newValue ?? "nao definido"}`;
    case "DUE_DATE_CHANGED":
      return `Prazo alterado para ${newValue ? formatDate(newValue) : "nao definido"}`;
    default:
      return "Alteracao registrada";
  }
};
