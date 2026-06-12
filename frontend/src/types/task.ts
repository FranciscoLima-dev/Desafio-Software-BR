export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  responsible?: string | null;
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  pending: number;
  completed: number;
  overdue: number;
};

export type TaskFilters = {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  responsible?: string;
  dueDate?: string;
};

export type TaskPayload = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  responsible?: string;
  dueDate: string;
};

export type TaskHistoryAction =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "RESPONSIBLE_CHANGED"
  | "DUE_DATE_CHANGED";

export type TaskHistoryEntry = {
  id: string;
  taskId: string;
  action: TaskHistoryAction;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: string;
};
