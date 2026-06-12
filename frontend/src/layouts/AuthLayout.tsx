import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AuthLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-medium text-slate-200">
        Carregando sessao...
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
        <section className="grid w-full gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="hidden max-w-xl lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Task Manager
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight text-white">
              Organize tarefas com foco, contexto e propriedade.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Uma base limpa para acompanhar prioridades, responsaveis e prazos sem perder o controle do fluxo.
            </p>
          </div>

          <div className="w-full rounded-lg border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
