import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { TaskForm } from "../../components/tasks/TaskForm";
import { taskService } from "../../services/task.service";
import type { Task, TaskPayload } from "../../types/task";
import { getApiErrorMessage } from "../../utils/api-error";

export function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTask = async () => {
      if (!id) {
        setError("Tarefa nao encontrada.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await taskService.findById(id);

        if (isMounted) {
          setTask(data);
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

    void loadTask();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (payload: TaskPayload) => {
    if (!id) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await taskService.update(id, payload);
      toast.success("Tarefa atualizada com sucesso.");
      navigate("/tasks", { replace: true });
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Editar tarefa</h1>
        <p className="mt-2 text-sm text-slate-400">
          Atualize os detalhes e acompanhe o historico da tarefa.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="space-y-5">
            <div className="h-11 animate-pulse rounded bg-slate-800" />
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="h-11 animate-pulse rounded bg-slate-800" />
              <div className="h-11 animate-pulse rounded bg-slate-800" />
              <div className="h-11 animate-pulse rounded bg-slate-800" />
              <div className="h-11 animate-pulse rounded bg-slate-800" />
            </div>
            <div className="h-28 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      ) : task ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex justify-end">
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
              to={`/tasks/${task.id}/history`}
            >
              Ver historico
            </Link>
          </div>
          <TaskForm
            initialTask={task}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Salvar alteracoes"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-sm text-slate-400">Tarefa nao encontrada.</p>
          <Link
            className="mt-4 inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            to="/tasks"
          >
            Voltar para tarefas
          </Link>
        </div>
      )}
    </section>
  );
}
