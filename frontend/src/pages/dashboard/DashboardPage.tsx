import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardSummary } from "../../types/task";
import { getApiErrorMessage } from "../../utils/api-error";

const emptySummary: DashboardSummary = {
  completed: 0,
  overdue: 0,
  pending: 0,
};

const cards = [
  {
    description: "Pendentes e em andamento",
    key: "pending",
    label: "Pendentes",
  },
  {
    description: "Finalizadas com sucesso",
    key: "completed",
    label: "Concluidas",
  },
  {
    description: "Prazo vencido e nao concluidas",
    key: "overdue",
    label: "Atrasadas",
  },
] as const;

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardService.summary();

        if (isMounted) {
          setSummary(data);
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

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Visao inicial da sua operacao de tarefas.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-sm shadow-black/10"
            key={card.key}
          >
            <p className="text-sm font-medium text-slate-400">{card.label}</p>
            {isLoading ? (
              <div className="mt-4 h-10 w-24 animate-pulse rounded bg-slate-800" />
            ) : (
              <strong className="mt-3 block text-4xl font-semibold text-white">
                {summary[card.key]}
              </strong>
            )}
            <p className="mt-3 text-sm text-slate-500">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
