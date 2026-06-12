import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { getApiErrorMessage } from "../../utils/api-error";
import { loginFormSchema, type LoginFormValues } from "../../utils/auth-validation";

type RedirectState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectTo = (location.state as RedirectState | null)?.from?.pathname ?? "/dashboard";

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      await login(values);
      toast.success("Login realizado com sucesso.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error);
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Entrar</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Acesse sua conta para acompanhar tarefas, prazos e prioridades.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoComplete="email"
          error={errors.email?.message}
          label="E-mail"
          type="email"
          {...register("email")}
        />
        <TextField
          autoComplete="current-password"
          error={errors.password?.message}
          label="Senha"
          type="password"
          {...register("password")}
        />

        {serverError ? (
          <div className="rounded-md border border-red-400/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {serverError}
          </div>
        ) : null}

        <Button className="w-full" isLoading={isSubmitting} type="submit">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Ainda não tem conta?{" "}
        <Link className="font-semibold text-emerald-300 hover:text-emerald-200" to="/register">
          Criar cadastro
        </Link>
      </p>
    </section>
  );
}
