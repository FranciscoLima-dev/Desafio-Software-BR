import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TaskForm } from "../../components/tasks/TaskForm";
import { taskService } from "../../services/task.service";
import type { TaskPayload } from "../../types/task";
import { getApiErrorMessage } from "../../utils/api-error";

export function CreateTaskPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload: TaskPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await taskService.create(payload);
      toast.success("Tarefa criada com sucesso.");
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
        <h1 className="text-2xl font-semibold text-white">Nova tarefa</h1>
        <p className="mt-2 text-sm text-slate-400">
          Registre uma tarefa com prioridade, responsável e prazo bem definidos.
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <TaskForm isSubmitting={isSubmitting} onSubmit={handleSubmit} submitLabel="Criar tarefa" />
      </div>
    </section>
  );
}
