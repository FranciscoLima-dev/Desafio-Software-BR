import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

export function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Sessão encerrada.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div>
            <p className="text-base font-semibold text-white">Task Manager</p>
            <p className="text-xs text-slate-400">{user?.name}</p>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white",
                  isActive && "bg-slate-900 text-white",
                )
              }
              to="/dashboard"
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white",
                  isActive && "bg-slate-900 text-white",
                )
              }
              to="/tasks"
            >
              Tarefas
            </NavLink>
            <Button className="ml-2 h-9 px-3" onClick={handleLogout} variant="secondary">
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
