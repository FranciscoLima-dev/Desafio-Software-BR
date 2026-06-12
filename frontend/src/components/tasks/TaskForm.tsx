import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { SelectField } from "../form/SelectField";
import { TextAreaField } from "../form/TextAreaField";
import { TextField } from "../form/TextField";
import { Button } from "../ui/Button";
import type { Task } from "../../types/task";
import { taskPriorityOptions, taskStatusOptions, toDateInputValue } from "../../utils/task-format";
import { taskFormSchema, toTaskPayload, type TaskFormValues } from "../../utils/task-validation";

type TaskFormProps = {
  initialTask?: Task;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (values: ReturnType<typeof toTaskPayload>) => Promise<void>;
};

const defaultValues: TaskFormValues = {
  description: "",
  dueDate: "",
  priority: "MEDIUM",
  responsible: "",
  status: "PENDING",
  title: "",
};

export function TaskForm({
  initialTask,
  isSubmitting = false,
  onSubmit,
  submitLabel,
}: TaskFormProps) {
  const {
    formState: { errors, isSubmitting: isFormSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!initialTask) {
      reset(defaultValues);
      return;
    }

    reset({
      description: initialTask.description ?? "",
      dueDate: toDateInputValue(initialTask.dueDate),
      priority: initialTask.priority,
      responsible: initialTask.responsible ?? "",
      status: initialTask.status,
      title: initialTask.title,
    });
  }, [initialTask, reset]);

  const isBusy = isSubmitting || isFormSubmitting;

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((values) => onSubmit(toTaskPayload(values)))}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <TextField
            error={errors.title?.message}
            label="Título"
            placeholder="Ex.: Revisar proposta do cliente"
            {...register("title")}
          />
        </div>

        <SelectField
          error={errors.status?.message}
          label="Status"
          options={[...taskStatusOptions]}
          {...register("status")}
        />

        <SelectField
          error={errors.priority?.message}
          label="Prioridade"
          options={[...taskPriorityOptions]}
          {...register("priority")}
        />

        <TextField
          error={errors.responsible?.message}
          label="Responsável"
          placeholder="Nome da pessoa responsável"
          {...register("responsible")}
        />

        <TextField
          error={errors.dueDate?.message}
          label="Data limite"
          type="date"
          {...register("dueDate")}
        />

        <div className="lg:col-span-2">
          <TextAreaField
            error={errors.description?.message}
            label="Descrição"
            placeholder="Detalhes, contexto ou critérios de conclusão"
            {...register("description")}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          to="/tasks"
        >
          Cancelar
        </Link>
        <Button className="sm:w-auto" isLoading={isBusy} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
