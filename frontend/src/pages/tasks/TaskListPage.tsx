import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { taskService } from "../../services/task.service";
import type { Task, TaskFilters, TaskPriority, TaskStatus } from "../../types/task";
import { getApiErrorMessage } from "../../utils/api-error";
import {
  formatDate,
  taskPriorityLabel,
  taskPriorityOptions,
  taskStatusLabel,
  taskStatusOptions,
} from "../../utils/task-format";

const priorityClasses: Record<TaskPriority, string> = {
  HIGH: "border-red-400/30 bg-red-950/40 text-red-200",
  LOW: "border-slate-700 bg-slate-950 text-slate-300",
  MEDIUM: "border-amber-400/30 bg-amber-950/30 text-amber-200",
};

const statusClasses: Record<TaskStatus, string> = {
  COMPLETED: "border-emerald-400/30 bg-emerald-950/30 text-emerald-200",
  IN_PROGRESS: "border-sky-400/30 bg-sky-950/30 text-sky-200",
  PENDING: "border-slate-700 bg-slate-950 text-slate-300",
};

export function TaskListPage() {
  const [filters, setFilters] = useState<TaskFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setTasks(await taskService.list(filters));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        search: searchInput.trim() || undefined,
      }));
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({});
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      setUpdatingStatusId(task.id);
      const updatedTask = await taskService.updateStatus(task.id, status);
      setTasks((currentTasks) => {
        const statusMatches = !filters.status || filters.status === updatedTask.status;

        if (!statusMatches) {
          return currentTasks.filter((currentTask) => currentTask.id !== updatedTask.id);
        }

        return currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        );
      });
      toast.success("Status atualizado.");
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (task: Task) => {
    try {
      setDeletingId(task.id);
      await taskService.remove(task.id);
      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));
      setTaskPendingDeletion(null);
      toast.success("Tarefa excluída.");
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tarefas</h1>
          <p className="mt-2 text-sm text-slate-400">
            Consulte, filtre e atualize suas tarefas em um único lugar.
          </p>
        </div>
        <Link
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-emerald-500 px-4 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-950/20 transition hover:bg-emerald-400 sm:w-auto"
          to="/tasks/new"
        >
          Nova tarefa
        </Link>
      </div>

      <div className="mb-5 grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
        <input
          className="h-11 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por título ou descrição"
          value={searchInput}
        />

        <select
          className="h-11 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          onChange={(event) => updateFilter("status", event.target.value)}
          value={filters.status ?? ""}
        >
          <option value="">Todos os status</option>
          {taskStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="h-11 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          onChange={(event) => updateFilter("priority", event.target.value)}
          value={filters.priority ?? ""}
        >
          <option value="">Todas as prioridades</option>
          {taskPriorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          className="h-11 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          onChange={(event) => updateFilter("responsible", event.target.value)}
          placeholder="Responsável"
          value={filters.responsible ?? ""}
        />

        <input
          aria-label="Filtrar por data limite"
          className="h-11 rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          onChange={(event) => updateFilter("dueDate", event.target.value)}
          type="date"
          value={filters.dueDate ?? ""}
        />

        <button
          className="h-11 rounded-md border border-slate-700 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          onClick={clearFilters}
          type="button"
        >
          Limpar
        </button>
      </div>

      {error ? (
        <div className="mb-5 rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-left">
            <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Prioridade</th>
                <th className="px-4 py-3 font-semibold">Responsável</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Data limite</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                      <td className="px-4 py-4" key={cellIndex}>
                        <div className="h-5 animate-pulse rounded bg-slate-800" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : tasks.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-400" colSpan={6}>
                    Nenhuma tarefa encontrada.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr className="align-middle text-sm text-slate-300" key={task.id}>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{task.title}</p>
                        {task.description ? (
                          <p className="mt-1 line-clamp-1 max-w-md text-xs text-slate-500">
                            {task.description}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}
                      >
                        {taskPriorityLabel[task.priority]}
                      </span>
                    </td>
                    <td className="px-4 py-4">{task.responsible || "Não definido"}</td>
                    <td className="px-4 py-4">
                      <select
                        className={`h-9 rounded-md border px-2 text-xs font-semibold outline-none ${statusClasses[task.status]}`}
                        disabled={updatingStatusId === task.id}
                        onChange={(event) =>
                          void handleStatusChange(task, event.target.value as TaskStatus)
                        }
                        value={task.status}
                      >
                        {taskStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">{formatDate(task.dueDate)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          className="rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                          to={`/tasks/${task.id}/edit`}
                        >
                          Editar
                        </Link>
                        <Link
                          className="rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                          to={`/tasks/${task.id}/history`}
                        >
                          Histórico
                        </Link>
                        <button
                          className="rounded-md border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deletingId === task.id}
                          onClick={() => setTaskPendingDeletion(task)}
                          type="button"
                        >
                          {deletingId === task.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {taskPendingDeletion ? (
        <div
          aria-labelledby="delete-task-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-950/40">
            <h2 className="text-lg font-semibold text-white" id="delete-task-title">
              Excluir tarefa
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Tem certeza que deseja excluir a tarefa{" "}
              <span className="font-semibold text-slate-100">"{taskPendingDeletion.title}"</span>?
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="h-10 rounded-md border border-slate-700 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deletingId === taskPendingDeletion.id}
                onClick={() => setTaskPendingDeletion(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-10 rounded-md bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deletingId === taskPendingDeletion.id}
                onClick={() => void handleDelete(taskPendingDeletion)}
                type="button"
              >
                {deletingId === taskPendingDeletion.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
