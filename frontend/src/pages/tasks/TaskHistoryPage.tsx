import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { taskService } from "../../services/task.service";
import type { Task, TaskHistoryEntry } from "../../types/task";
import { getApiErrorMessage } from "../../utils/api-error";
import { formatDate, formatHistoryDescription } from "../../utils/task-format";

export function TaskHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      if (!id) {
        setError("Tarefa nao encontrada.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [taskData, historyData] = await Promise.all([
          taskService.findById(id),
          taskService.history(id),
        ]);

        if (isMounted) {
          setTask(taskData);
          setHistory(historyData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getApiErrorMessage(requestError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Historico da tarefa</h1>
          <p className="mt-2 text-sm text-slate-400">
            {task?.title ?? "Acompanhe as alteracoes registradas para esta tarefa."}
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
          to={task ? `/tasks/${task.id}/edit` : "/tasks"}
        >
          {task ? "Editar tarefa" : "Voltar"}
        </Link>
      </div>

      {error ? (
        <div className="mb-5 rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="flex gap-4" key={index}>
                <div className="h-5 w-28 animate-pulse rounded bg-slate-800" />
                <div className="h-5 flex-1 animate-pulse rounded bg-slate-800" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            Nenhuma alteracao registrada.
          </div>
        ) : (
          <ol className="space-y-5">
            {history.map((entry) => (
              <li className="grid gap-2 border-b border-slate-800 pb-5 last:border-0 last:pb-0 sm:grid-cols-[130px_1fr]" key={entry.id}>
                <time className="text-sm font-medium text-slate-400">
                  {formatDate(entry.createdAt)}
                </time>
                <p className="text-sm text-slate-100">{formatHistoryDescription(entry)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
